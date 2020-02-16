import * as React from 'react';
import { requireNativeComponent, StyleProp, ViewStyle, Animated } from 'react-native';
import { SAnimated, SAnimatedDynamic } from './SAnimated';

//
// Native View
//

type PointerEvents = 'box-none' | 'none' | 'box-only' | 'auto';

// interface RNFastAnimatedViewProps {
//     style?: StyleProp<ViewStyle>;
//     animatedKey: string;
//     pointerEvents?: PointerEvents;
// }

const RNOAnimatedView = requireNativeComponent('RNOAnimatedView');
const RNOAnimatedViewAnimated = Animated.createAnimatedComponent(RNOAnimatedView);

//
// Wrapper
//

export interface SAnimatedViewProps {
    name: string;
    style?: StyleProp<ViewStyle>;
    pointerEvents?: PointerEvents;
}

export interface SAnimatedViewState {
    translateX?: Animated.AnimatedInterpolation;
    translateY?: Animated.AnimatedInterpolation;
    opacity?: Animated.AnimatedInterpolation;
}

export class SAnimatedView extends React.PureComponent<SAnimatedViewProps, SAnimatedViewState> {

    private _unsubscribe: () => void;
    private _handler = (src: SAnimatedDynamic) => {
        this.setState({ translateX: src.translateX, translateY: src.translateY, opacity: src.opacity });
    }

    constructor(props: SAnimatedViewProps) {
        super(props);
        this._unsubscribe = SAnimated.onViewMounted(this.props.name, this._handler);
        this.state = {};
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <RNOAnimatedViewAnimated
                style={[
                    this.props.style,
                    ((this.state.translateX !== undefined) || (this.state.translateY !== undefined)) && {
                        transform: [
                            ...(this.state.translateX ? [{ translateX: this.state.translateX }] : []),
                            ...(this.state.translateY ? [{ translateY: this.state.translateX }] : []),
                        ]
                    },
                        this.state.opacity !== undefined && {
                            opacity: this.state.opacity
                        }
                ]}
                animatedKey={this.props.name}
                pointerEvents={this.props.pointerEvents}
            >
                {this.props.children}
            </RNOAnimatedViewAnimated>
        );
    }
}