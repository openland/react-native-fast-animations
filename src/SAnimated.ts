import { SAnimatedView } from './SAnimatedView';
import { NativeModules, NativeEventEmitter, Platform, DeviceEventEmitter, Animated } from 'react-native';
import { SAnimatedProperty } from './SAnimatedProperty';
import uuid from 'uuid/v4';

const RNOAnimatedViewManager = NativeModules.RNOAnimatedViewManager as {
    animate: (config: string) => void,
    hasPending: (callback: (v: boolean) => void) => boolean
};
const RNOAnimatedEventEmitter = new NativeEventEmitter(NativeModules.RNOAnimatedEventEmitter);

export type SAnimatedPropertyName = 'translateX' | 'translateY' | 'opacity' | 'scale' | 'ios-width' | 'ios-height';
export type SAnimatedPropertyAnimator = (name: string, property: SAnimatedPropertyName, from: number, to: number) => void;

//
// Timing
// 

export type SAnimatedEasing = 'linear' | 'material' | { bezier: number[] };

export interface SAnimatedTimingConfig {
    property: SAnimatedPropertyName;
    from: number;
    to: number;
    duration?: number;
    delay?: number;
    optional?: boolean;
    easing?: SAnimatedEasing;
}

export interface SAnimatedCircularConfig {
    from: number;
    to: number;
    duration?: number;
    centerX?: number;
    centerY?: number;
}

function resolveEasing(easing?: SAnimatedEasing) {
    if (!easing || easing === 'linear') {
        return {
            type: 'linear'
        };
    }
    if (easing === 'material') {
        return {
            type: 'material'
        };
    } else {
        return {
            type: 'bezier',
            bezier: easing.bezier
        };
    }
}

export interface SAnimatedSpringConfig {
    property: SAnimatedPropertyName;
    from: number;
    to: number;
    duration?: number;
    delay?: number;
    optional?: boolean;
    velocity?: number;
}

export interface SAnimatedDynamic {
    translateX?: Animated.AnimatedInterpolation;
    translateY?: Animated.AnimatedInterpolation;
    opacity?: Animated.AnimatedInterpolation;
}

class SAnimatedImpl {
    View = SAnimatedView;

    private _inTransaction = false;
    private _pendingAnimations: any[] = [];
    private _pendingSetters: any[] = [];
    private _transactionDuration = 0.25;
    private _callbacks = new Map<string, (() => void)[]>();
    private _propertyAnimator?: SAnimatedPropertyAnimator;
    private _dirtyProperties = new Map<string, Map<SAnimatedPropertyName, { from: number, to: number }>>();
    private _transactionKey?: string;
    private _knownComponents = new Map<string, Set<string>>();
    private _subscriptions = new Map<string, Map<string, (src: SAnimatedDynamic) => void>>();
    private _dynamic = new Map<string, SAnimatedDynamic>();

    constructor() {
        if (Platform.OS === 'ios') {
            RNOAnimatedEventEmitter.addListener('onAnimationCompleted', (args: { key: string }) => {
                let clb = this._callbacks.get(args.key);
                if (clb) {
                    this._callbacks.delete(args.key);
                    for (let c of clb) {
                        c();
                    }
                }
            });
        } else if (Platform.OS === 'android') {
            DeviceEventEmitter.addListener('react_s_animation_completed', (args: { key: string }) => {
                let clb = this._callbacks.get(args.key);
                if (clb) {
                    this._callbacks.delete(args.key);
                    for (let c of clb) {
                        c();
                    }
                }
            });
        }
    }

    onPropertyChanged = (property: SAnimatedProperty, oldValue: number) => {
        if (!this._knownComponents.has(property.name)) {
            this._knownComponents.set(property.name, new Set());
        }
        let known = this._knownComponents.get(property.name)!;
        if (property.value !== oldValue || !known.has(property.property)) {
            known.add(property.property);
            if (this._inTransaction) {
                if (!this._dirtyProperties.has(property.name)) {
                    this._dirtyProperties.set(property.name, new Map());
                }
                let m = this._dirtyProperties.get(property.name)!;
                if (m.has(property.property)) {
                    m.get(property.property)!.to = property.value;
                } else {
                    m.set(property.property, { from: oldValue, to: property.value });
                }
            } else {
                this.setValue(property.name, property.property, property.value);
            }
        }
    }

    setValue = (name: string, property: SAnimatedPropertyName, value: number) => {
        if (typeof value === 'number') {
            let v = {
                view: name,
                prop: property,
                to: value
            };
            if (this._inTransaction) {
                this._pendingSetters.push(v);
            } else {
                this._postAnimations(this._transactionDuration, [], [v], undefined);
            }
        }
    }

    //
    // Dynamic
    //

    getDynamic(name: string): SAnimatedDynamic {
        let ex = this._dynamic.get(name);
        if (ex) {
            return ex;
        } else {
            return {};
        }
    }

    startDynamic(name: string, property: SAnimatedPropertyName, value: Animated.AnimatedInterpolation) {
        if (property === 'opacity') {
            let ex = this._dynamic.get(name);
            if (!ex) {
                ex = {
                    opacity: value
                };
                this._dynamic.set(name, ex);
            } else {
                ex.opacity = value;
            }
            let s = this._subscriptions.get(name);
            if (s) {
                for (let v of s.values()) {
                    v(ex!);
                }
            }
        }
    }

    stopDynamic(name: string, property: SAnimatedPropertyName) {
        if (property === 'opacity') {
            let ex = this._dynamic.get(name);
            if (!ex) {
                ex = {
                    opacity: undefined
                };
                this._dynamic.set(name, ex);
            } else {
                ex.opacity = undefined;
            }
            let s = this._subscriptions.get(name);
            if (s) {
                for (let v of s.values()) {
                    v(ex!);
                }
            }
        }
    }

    //
    // Transaction
    //

    get isInTransaction() {
        return this._inTransaction;
    }

    get isInAnimatedTransaction() {
        return this._inTransaction && !!this._propertyAnimator;
    }

    beginTransaction = () => {
        if (this._inTransaction) {
            return;
        }
        this._inTransaction = true;
        this._transactionDuration = 0.25;
        this._transactionKey = uuid();
    }

    setDuration = (duration: number) => {
        if (!this._inTransaction) {
            console.warn('You can\'t set global duration outside transaction');
            return;
        }
        this._transactionDuration = duration;
    }

    setPropertyAnimator = (animator: SAnimatedPropertyAnimator) => {
        if (!this._inTransaction) {
            console.warn('You can\'t set property animator duration outside transaction');
            return;
        }
        this._propertyAnimator = animator;
    }

    setDefaultPropertyAnimator = () => {
        if (Platform.OS === 'android') {
            this.setPropertyAnimator((name, prop, from, to) => {
                this.timing(name, {
                    property: prop,
                    from: from,
                    to: to,
                    easing: 'material'
                });
            });
        } else {
            this.setPropertyAnimator((name, prop, from, to) => {
                this.spring(name, {
                    property: prop,
                    from: from,
                    to: to
                });
            });
        }
    }

    addTransactionCallback = (callback: () => void) => {
        if (!this._inTransaction) {
            callback();
        }

        if (this._callbacks.has(this._transactionKey!)) {
            this._callbacks.get(this._transactionKey!)!.push(callback);
        } else {
            this._callbacks.set(this._transactionKey!, [callback]);
        }
    }

    commitTransaction = (callback?: () => void) => {
        if (callback) {
            this.addTransactionCallback(callback);
        }

        if (this._dirtyProperties.size !== 0) {
            for (let p of this._dirtyProperties.keys()) {
                let pmap = this._dirtyProperties.get(p)!;
                for (let p2 of pmap.keys()) {
                    let p3 = pmap.get(p2)!;
                    if (this._propertyAnimator) {
                        this._propertyAnimator(p, p2, p3.from, p3.to);
                    } else {
                        this.setValue(p, p2, p3.to);
                    }
                }
            }
            this._dirtyProperties.clear();
        }

        if (!this._inTransaction) {
            return;
        }

        if (this._pendingAnimations.length > 0 || this._pendingSetters.length > 0) {
            let transactionKey: string | undefined = undefined;
            if (this._callbacks.get(this._transactionKey!)) {
                transactionKey = this._transactionKey!!;
            }
            this._postAnimations(this._transactionDuration, this._pendingAnimations, this._pendingSetters, transactionKey);
            this._pendingAnimations = [];
            this._pendingSetters = [];
        } else {
            let clb = this._callbacks.get(this._transactionKey!);
            if (clb) {
                this._callbacks.delete(this._transactionKey!);
                for (let c of clb) {
                    c();
                }
            }
        }

        this._inTransaction = false;
        this._transactionDuration = 0.25;
        this._propertyAnimator = undefined;
    }

    //
    // Animation
    //

    timing = (name: string, animation: SAnimatedTimingConfig) => {
        let anim = {
            view: name,
            type: 'timing',
            prop: animation.property,
            from: animation.from,
            to: animation.to,
            optional: animation.optional,
            duration: animation.duration,
            delay: animation.delay,
            easing: resolveEasing(animation.easing)
        };
        if (this._inTransaction) {
            this._pendingAnimations.push(anim);
        } else {
            this._postAnimations(this._transactionDuration, [anim], [], undefined);
        }
    }

    spring = (name: string, animation: SAnimatedSpringConfig) => {
        let anim = {
            view: name,
            type: 'spring',
            prop: animation.property,
            from: animation.from,
            to: animation.to,
            optional: animation.optional,
            velocity: animation.velocity,
            delay: animation.delay
        };
        if (this._inTransaction) {
            this._pendingAnimations.push(anim);
        } else {
            this._postAnimations(this._transactionDuration, [anim], [], undefined);
        }
    }

    circular = (name: string, animation: SAnimatedCircularConfig) => {
        let anim = {
            view: name,
            type: 'circular',
            from: animation.from,
            to: animation.to,
            duration: animation.duration,
            centerX: animation.centerX,
            centerY: animation.centerY
        };
        if (this._inTransaction) {
            this._pendingAnimations.push(anim);
        } else {
            this._postAnimations(this._transactionDuration, [anim], [], undefined);
        }
    }

    private _postAnimations(duration: number, animations: any[], valueSetters: any[], transactionKey: string | undefined) {
        RNOAnimatedViewManager.animate(
            JSON.stringify({
                duration,
                animations,
                valueSetters,
                transactionKey
            }));
    }

    onViewMounted = (name: string, handler: (src: SAnimatedDynamic) => void) => {

        // Basic Map
        let map: Map<string, (src: SAnimatedDynamic) => void>;
        if (this._subscriptions.has(name)) {
            map = this._subscriptions.get(name)!;
        } else {
            map = new Map();
            this._subscriptions.set(name, map);
        }

        // Create subscription
        let key = uuid();
        map.set(key, handler);

        // Unsubscribe callback
        return () => {
            if (map.has(key)) {
                map.delete(key);
                if (map.size === 0) {
                    this._subscriptions.delete(name);
                }
                this._knownComponents.delete(name);
            } else {
                console.warn('Double unmount detected');
            }
        };
    }
}

export const SAnimated = new SAnimatedImpl();