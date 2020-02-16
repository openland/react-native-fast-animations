<!-- Bootstrapped with make-react-native-package v0.60.3 -->

# react-native-fast-animations
React Native animations via Core Animation or RenderThread API

## Status

Used in production at Openland for over the year.

## Installation

### 0. Setup Swift and Kotlin

- Open your iOS project in Xcode and create empty Swift file and bridging header to enable Swift support
- Modify `android/build.gradle`:

  ```diff
  buildscript {
    ext {
      ...
  +   kotlinVersion = "1.3.50"
    }
  ...

    dependencies {
  +   classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}")
      ...
  ```

### 1. Install latest version from npm

`yarn add react-native-fast-animations`

### 2. Install pods

`cd ios && pod install && cd ..`

## Example

```jsx
import * as React from 'react'
import { View } from 'react-native'
import {
  FastAnimations
} from 'react-native-fast-animations'

```

## License

MIT