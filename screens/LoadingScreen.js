import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase/compat";

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }
  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.props.navigation.navigate("DashboardScreen");
      } else {
        this.props.navigation.navigate("LoginScreen");
      }
    }.bind(this));
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
