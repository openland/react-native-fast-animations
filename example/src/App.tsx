import * as React from 'react';
import { View, SafeAreaView, ScrollView, Text, Button, Platform } from 'react-native';
import { SAnimatedView, SAnimated, SAnimatedShadowView } from 'react-native-fast-animations';
import uuid from 'uuid/v4';

const OpacityAnimation = React.memo(() => {
  const name = React.useMemo(() => uuid(), []);
  return (
    <View style={{ flexDirection: 'column', paddingHorizontal: 16, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Hide"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.timing(name, { property: 'opacity', from: 1, to: 0 });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Show"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.timing(name, { property: 'opacity', from: 0, to: 1 });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Move Right"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.spring(name, { property: 'translateX', from: 0, to: 100 });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Move Left"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.spring(name, { property: 'translateX', from: 100, to: 0 });
            SAnimated.commitTransaction();
          }}
        />
      </View>
      <SAnimatedView name={name} style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </View>
  );
});

const BackgroundColorAnimation = React.memo(() => {
  const name = React.useMemo(() => uuid(), []);
  return (
    <View style={{ flexDirection: 'column', paddingHorizontal: 16, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Red -> Blue"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.timing(name, { property: 'backgroundColor', from: '#ff0000', to: '#0000ff' });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Blue -> Red"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.timing(name, { property: 'backgroundColor', from: '#0000ff', to: '#ff0000' });
            SAnimated.commitTransaction();
          }}
        />
      </View>
      <SAnimatedView name={name} style={{ backgroundColor: '#ff0000', width: 100, height: 100 }} />
    </View>
  );
});

const ContiniousAnimation = React.memo(() => {
  const name = React.useMemo(() => uuid(), []);
  const shadowView = React.useMemo(() => new SAnimatedShadowView(name), []);
  return (
    <View style={{ flexDirection: 'column', paddingHorizontal: 16, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Hide"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.setDefaultPropertyAnimator(); // Enable default animations for all properties
            shadowView.opacity = 0;
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Show"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.setDefaultPropertyAnimator(); // Enable default animations for all properties
            shadowView.opacity = 1;
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Move Right"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.setDefaultPropertyAnimator(); // Enable default animations for all properties
            shadowView.translateX = 100;
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Move Left"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.setDefaultPropertyAnimator(); // Enable default animations for all properties
            shadowView.translateX = 0;
            SAnimated.commitTransaction();
          }}
        />
      </View>
      <SAnimatedView name={name} style={{ backgroundColor: 'blue', width: 100, height: 100 }} />
    </View>
  );
});

const TransactionalAnimation = React.memo(() => {
  const name1 = React.useMemo(() => uuid(), []);
  const name2 = React.useMemo(() => uuid(), []);
  return (
    <View style={{ flexDirection: 'column', paddingHorizontal: 16, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Play"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.spring(name1, { property: 'translateX', from: 0, to: 100 });
            SAnimated.spring(name2, { property: 'translateX', from: 0, to: -100 });
            SAnimated.spring(name2, { property: 'translateY', from: 10, to: -10 });
            SAnimated.spring(name1, { property: 'opacity', from: 0, to: 0.5 });
            SAnimated.commitTransaction();
          }}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <SAnimatedView name={name1} style={{ backgroundColor: 'blue', width: 100, height: 100, opacity: 0 }} />
        <View style={{ flexGrow: 1 }} />
        <SAnimatedView name={name2} style={{ backgroundColor: 'red', width: 100, height: 100 }} />
      </View>
    </View>
  );
});

const AppleAnimation = React.memo(() => {
  const name = React.useMemo(() => uuid(), []);
  return (
    <View style={{ flexDirection: 'column', paddingHorizontal: 16, paddingBottom: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        <Button
          title="Height+"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.spring(name, { property: 'ios-height', from: 0, to: 100 });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Height-"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.timing(name, { property: 'ios-height', from: 100, to: 0 });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Width+"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.spring(name, { property: 'ios-width', from: 0, to: 100 });
            SAnimated.commitTransaction();
          }}
        />
        <Button
          title="Width-"
          onPress={() => {
            SAnimated.beginTransaction();
            SAnimated.timing(name, { property: 'ios-width', from: 100, to: 0 });
            SAnimated.commitTransaction();
          }}
        />
      </View>
      <SAnimatedView name={name} style={{ backgroundColor: 'red', width: 100, height: 100 }} />
    </View>
  );
});

class App extends React.Component<{}> {

  render() {
    return (
      <SafeAreaView style={{ flexGrow: 1, flexDirection: 'column' }}>
        <ScrollView style={{ flexGrow: 1, flexDirection: 'column' }}>
          <View style={{ flexGrow: 1, flexDirection: 'column' }}>
            <Text style={{ height: 40, justifyContent: 'center', fontSize: 18, paddingHorizontal: 16, marginTop: 8 }}>Simple Animations</Text>
            <OpacityAnimation />
            <BackgroundColorAnimation />
            <Text style={{ height: 40, justifyContent: 'center', fontSize: 18, paddingHorizontal: 16, marginTop: 32 }}>Continous Animations</Text>
            <ContiniousAnimation />
            <Text style={{ height: 40, justifyContent: 'center', fontSize: 18, paddingHorizontal: 16, marginTop: 32 }}>Transactions</Text>
            <TransactionalAnimation />
            {Platform.OS === 'ios' && <Text style={{ height: 40, justifyContent: 'center', fontSize: 18, paddingHorizontal: 16, marginTop: 32 }}>iOS Specific</Text>}
            {Platform.OS === 'ios' && (<AppleAnimation />)}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default App
