import React, {Component} from "react";
import { View, Text, Button, StyleSheet} from "react-native";
import {GoogleSignIn, Expo} from "expo";
import * as Google from 'expo-google-app-auth'


class LoginScreen extends Component {
  signInWithGoogleAsync = async () => {
    console.log("signInWithGoogleAsync");
    try {
      const result = await Google.logInAsync({
       
        androidClientId: "292031254136-r6hubbm0o99r6dhcer6ggsv465uj05bi.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
      if (result.type === "success") {
        console.log("success");
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


  render() {
    return (
      <View style={styles.container}>
        <Text>LoginScreen</Text>
        <Button title="Login Google" onPress={() => this.signInWithGoogleAsync() }/>
      </View>
    );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});