import React from 'react'
import { View, StyleSheet } from 'react-native'
import {
  FastAnimations
} from 'react-native-fast-animations'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexWrap: 'wrap'
  },
  component: {
    width: 100,
    height: 100,
    margin: 5
  }
})

class App extends React.Component<{}> {

  render() {
    return (
      <View style={styles.container}>
        <FastAnimations
          style={styles.component}
          color={'#1ca57c'}
        />
      </View>
    )
  }
}

export default App
