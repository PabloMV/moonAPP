import React, { Component, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { GoogleSignIn, Expo } from "expo";
import * as Google from "expo-google-app-auth";
import firebase from "firebase/compat";
import { androidID } from "../config";
import * as Location from "expo-location";
let place = "";
  let location = "";
export default function LoginScreen(props) {
  // const [location , setLocation, place, setPlace] = useState(null);
  
  /*  useEffect(() => {
    runFunction();
  }, []);
  const runFunction = async () => {
    location = await Location.getCurrentPositionAsync({});
   // setLocation(location);
    console.log(location, "loginJS");
    place = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
   // setPlace(place);
    console.log(place, "loginJS");
  }; */

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.user.id
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    } else {
      return false;
    }
  };

  const onSignIn = (googleUser, address) => {
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    console.log("Google Auth Response", googleUser);
    console.log(address, "verification place");
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            console.log("User signed in!");
            firebase
              .database()
              .ref("/users/" + result.user.uid)
              .set({
                firstname: result.additionalUserInfo.profile.given_name,
                lastname: result.additionalUserInfo.profile.family_name,
                email: result.user.email,
                profile_picture: result.additionalUserInfo.profile.picture,
                locale: result.additionalUserInfo.profile.locale,
                adressess: {
                  autoAddres: {
                    country: address[0].country,
                    state: address[0].region,
                    city: address[0].subregion,
                    district: address[0].district,
                    street: address[0].street,
                    street_number: address[0].name,
                    postal_code: address.postalCode,
                  },
                },
              });
          })
          .catch((error) => {
            console.log("Error signing in with Google:", error);
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  const signInWithGoogleAsync = async () => {
    console.log("signInWithGoogleAsync");
    try {
      location = await Location.getCurrentPositionAsync({});
      console.log(location, "loginJS");
      place = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      console.log(place, "loginJS");
      const result = await Google.logInAsync({
        androidClientId: androidID,
        scopes: ["profile", "email"],
      });
      if (result.type === "success" && place.length > 0) {
        console.log("success");
        console.log(result.accessToken);
        onSignIn(result, place);
        return result.accessToken;
      } else {
        console.log("error");
        return { cancelled: true };
      }
    } catch (e) {
      console.log(e);
      return { error: true };
    }
  };

  return (
    <View style={styles.container}>
      <Text>LoginScreen</Text>
      <Button title="Login Google" onPress={() => signInWithGoogleAsync()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
