import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createStore } from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './component/HomeScreen';
import SetScreen from './component/SetScreen';
import SetScreen2 from './component/SetScreen2';

import WebScreen from './component/WebScreen';
import IntroScreen from './component/IntroScreen';
import SetBookScreen from './component/SetBookScreen';
import BookingScreen1 from './component/BookingScreen1';
import BookingScreen2 from './component/BookingScreen2';
import BookingScreen3 from './component/BookingScreen3';


const store = createStore(reducers);
const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Set: {
      screen: SetScreen,
    },
    Set2: {
      screen: SetScreen2,
    },
    Web: {
      screen: WebScreen,
    },
    Intro:{
      screen: IntroScreen
    },
    SetBook:{
      screen: SetBookScreen
    },
    Booking1:{
      screen: BookingScreen1
    },
    Booking2:{
      screen: BookingScreen2
    },
    Booking3:{
      screen: BookingScreen3
    }
  },
  {
    initialRouteName:'Home',
  }
);
const Stack = createNativeStackNavigator();

const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    SplashScreen.hide();

    return (
      <Provider store={store}>
        {/* <AppContainer /> */}
        <NavigationContainer initialRouteName="Home">
          <Stack.Navigator
            screenOptions={{
              headerShown:false
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Set" component={SetScreen}/>
            <Stack.Screen name="Set2" component={SetScreen2}/>
            <Stack.Screen name="Web" component={WebScreen}/>
            <Stack.Screen name="Intro" component={IntroScreen}/>
            <Stack.Screen name="SetBook" component={SetBookScreen}/>
            <Stack.Screen name="Booking1" component={BookingScreen1}/>
            <Stack.Screen name="Booking2" component={BookingScreen2}/>
            <Stack.Screen name="Booking3" component={BookingScreen3}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}
// SplashScreen.hide();
