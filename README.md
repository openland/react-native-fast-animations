<!-- Bootstrapped with make-react-native-package v0.60.3 -->

# react-native-fast-animations
[![npm version](https://badge.fury.io/js/react-native-fast-animations.svg)](https://badge.fury.io/js/react-native-fast-animations)
[![CircleCI](https://circleci.com/gh/ex3ndr/react-native-fast-animations.svg?style=svg)](https://circleci.com/gh/ex3ndr/react-native-fast-animations)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/standard/standard)
[![Dependency Status](https://david-dm.org/ex3ndr/react-native-fast-animations.svg)](https://david-dm.org/ex3ndr/react-native-fast-animations)
[![devDependencies Status](https://david-dm.org/ex3ndr/react-native-fast-animations/dev-status.svg)](https://david-dm.org/ex3ndr/react-native-fast-animations?type=dev)
[![typings included](https://img.shields.io/badge/typings-included-brightgreen.svg?t=1495378566925)](package.json)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/react-native-fast-animations)

Yet another react-native package

## Status

- iOS & Android:
  - ???
- react-native:
  - supported versions "<strong>&gt;= 0.60.5</strong>"

## Installation

<table>
<td>
<details style="border: 1px solid; border-radius: 5px; padding: 5px">
  <summary>with react-native "<strong>&gt;=0.60.5</strong>"</summary>

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

</details>
</td>
</table>

## Example

```jsx
import * as React from 'react'
import { View } from 'react-native'
import {
  FastAnimations
} from 'react-native-fast-animations'

```

## Reference

<table>
  <tr>
    <th>prop</th>
    <th>type</th>
    <th>default</th>
    <th>desc</th>
  </tr>
  <tr>
    <td>color</td>
    <td><code>string</code></td>
    <td><code>'red'</code></td>
    <td>-</td>
  </tr>
</table>
