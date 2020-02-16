import { SAnimatedPropertyName, SAnimated } from './SAnimated';
import { Animated } from 'react-native';

export class SAnimatedProperty {
    readonly name: string;
    readonly property: SAnimatedPropertyName;
    private _value: number;

    get value(): number {
        return this._value;
    }
    set value(newValue: number) {
        let oldValue = this._value;
        this._value = newValue;
        SAnimated.onPropertyChanged(this, oldValue);
    }

    startDynamic(value: Animated.AnimatedInterpolation) {
        SAnimated.startDynamic(this.name, this.property, value);
    }

    stopDynamic() {
        SAnimated.stopDynamic(this.name, this.property);
    }

    constructor(name: string, property: SAnimatedPropertyName, value: number) {
        this.name = name;
        this.property = property;
        this._value = value;
    }
}