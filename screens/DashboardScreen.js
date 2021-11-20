import React, { Component, useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import firebase from "firebase/compat";
import * as Location from "expo-location";

export default function DashboardScreen({ navigation }) {
  const [place, setPlace] = useState(null);
  useEffect( async () => {
    const location = await Location.getCurrentPositionAsync({});
    
    console.log(location, "dashboardJS");

    const place = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setPlace(place);
    console.log(place, "dashboardJS");  
    Alert.alert(
    'ATENÇÃO',
    `Seu endereçõ está correto? \nRua:${place[0].street} Número:${place[0].name} Bairro:${place[0].district}, CEP:${place[0].postalCode}`,
    [{text:'Sim'}, {text:'Não'}]);
  }, []);
  
    
  return (
    <View style={styles.container}>
      <Text>DashboardScreen</Text>
      <Text>{firebase.auth().currentUser.displayName}</Text>
      <Text>{firebase.auth().currentUser.email}</Text>  
      <Button
        title="Sair da sua conta"
        onPress={() => firebase.auth().signOut()}
      />
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
