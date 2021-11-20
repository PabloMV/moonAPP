import { StatusBar } from "expo-status-bar"; 
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
//import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { NavigationContainer } from "@react-navigation/native";
//screens/////////////////////////////////////////////////////////
import LoginScreen from "./screens/LoginScreen";
import LoadingScreen from "./screens/LoadingScreen";
import DashboardScreen from "./screens/DashboardScreen";
//end screens/////////////////////////////////////////////////////
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { firebaseConfig } from "./config";
import * as Notifications from "expo-notifications";
//import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

firebase.initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location , "appJS");
      console.log(location);
      let getAddress = await Location.reverseGeocodeAsync({'latitude':location.coords.latitude,'longitude':location.coords.longitude})
      console.log(getAddress, "appJS");
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log(token);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  async function registerForPushNotificationsAsync() {
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="transparent" hidden={true} />
      <Stack.Navigator intialRouteName="Loading">       
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: {
              backgroundColor: "#00b894",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            headerStyle: {
              backgroundColor: "#00b894",
            },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

 /*  return <AppNavigator />; */
}

/* const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
}); */

/* const AppNavigator = createAppContainer(AppSwitchNavigator); */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
