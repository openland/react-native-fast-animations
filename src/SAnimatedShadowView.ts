import { SAnimatedProperty } from './SAnimatedProperty';
import { Animated } from 'react-native';

export class SAnimatedShadowView {
    readonly name: string;
    private readonly _opacity: SAnimatedProperty;
    private readonly _translateX: SAnimatedProperty;
    private readonly _translateY: SAnimatedProperty;
    private readonly _scale: SAnimatedProperty;
    private readonly _iosWidth: SAnimatedProperty;
    private readonly _iosHeight: SAnimatedProperty;
    private readonly _backgroundColor: SAnimatedProperty;

    get opacity() {
        return this._opacity.value as number;
    }
    set opacity(value: number) {
        this._opacity.value = value;
    }

    set opacityDynamic(value: Animated.AnimatedInterpolation | undefined) {
        if (value) {
            this._opacity.startDynamic(value);
        } else {
            this._opacity.stopDynamic();
        }
    }

    get scale() {
        return this._scale.value as number;
    }
    set scale(value: number) {
        this._scale.value = value;
    }
    set scaleDynamic(value: Animated.AnimatedInterpolation | undefined) {
        if (value) {
            this._scale.startDynamic(value);
        } else {
            this._scale.stopDynamic();
        }
    }

    get translateX() {
        return this._translateX.value as number;
    }
    set translateX(value: number) {
        this._translateX.value = value;
    }

    get translateY() {
        return this._translateY.value as number;
    }
    set translateY(value: number) {
        this._translateY.value = value;
    }

    get iosWidth() {
        return this._iosWidth.value as number;
    }
    set iosWidth(value: number) {
        this._iosWidth.value = value;
    }

    get iosHeight() {
        return this._iosHeight.value as number;
    }
    set iosHeight(value: number) {
        this._iosHeight.value = value;
    }

    get backgroundColor() {
        return this._backgroundColor.value as string;
    }
    set backgroundColor(value: string) {
        this._backgroundColor.value = value;
    }

    constructor(name: string, initial?: { opacity?: number, scale?: number, translateX?: number, translateY?: number, backgroundColor?: string }) {
        this.name = name;
        this._opacity = new SAnimatedProperty(name, 'opacity', initial && initial.opacity !== undefined ? initial.opacity : 1);
        this._scale = new SAnimatedProperty(name, 'scale', initial && initial.scale !== undefined ? initial.scale : 1);
        this._translateX = new SAnimatedProperty(name, 'translateX', initial && initial.translateX !== undefined ? initial.translateX : 0);
        this._translateY = new SAnimatedProperty(name, 'translateY', initial && initial.translateY !== undefined ? initial.translateY : 0);
        this._iosWidth = new SAnimatedProperty(name, 'ios-width', 0);
        this._iosHeight = new SAnimatedProperty(name, 'ios-height', 0);
        this._backgroundColor = new SAnimatedProperty(name, 'backgroundColor', initial && initial.backgroundColor !== undefined ? initial.backgroundColor : 'transparent');
    }
}