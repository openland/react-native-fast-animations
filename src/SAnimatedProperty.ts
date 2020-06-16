import { SAnimatedPropertyName, SAnimatedPropertyValue, SAnimated } from './SAnimated';
import { Animated } from 'react-native';

export class SAnimatedProperty {
    readonly name: string;
    readonly property: SAnimatedPropertyName;
    private _value: SAnimatedPropertyValue;

    get value(): SAnimatedPropertyValue {
        return this._value;
    }
    set value(newValue: SAnimatedPropertyValue) {
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

    constructor(name: string, property: SAnimatedPropertyName, value: SAnimatedPropertyValue) {
        this.name = name;
        this.property = property;
        this._value = value;
    }
}