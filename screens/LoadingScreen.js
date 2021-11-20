import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase/compat";

export default function LoadingScreen(props) {
  
  
  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged((user) =>{
      console.log(user, "loadingScreen");
      if (user) {
        props.navigation.navigate("Dashboard");
        console.log("User is signed in. dashboard");
      } else {
        props.navigation.navigate("Login");
        console.log("User is not signed in. login");
      }
    });
  };
  checkIfLoggedIn();
 
 
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
