import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getCurrentLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }

    getCurrentLocation();
  }, []);

  const handleNavigateToCreatePost = () => {
    router.push("/createPost");
  };

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : null;

  const lat: number = location?.coords.latitude ?? 0;
  const lon: number = location?.coords.longitude ?? 0;

  type LatLng = {
    latitude: number;
    longitude: number;
  };

  const locations: Array<LatLng> = [
    { latitude: lat - 0.05, longitude: lon },
    { latitude: lat + 0.05, longitude: lon - 0.05 },
    { latitude: lat + 0.05, longitude: lon + 0.05 },
  ];

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={true}
          minZoomLevel={15}
          maxZoomLevel={17}
        >
          {locations.map((loc, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
              title={`Location ${index + 1}`}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.paragraph}>
          {errorMsg || "Loading your location..."}
        </Text>
      )}

      {/* Floating Plus Button to Navigate to CreatePost */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleNavigateToCreatePost}
      >
        <Ionicons name="add-circle" size={60} color="blue" />
      </TouchableOpacity>
      <Polygon coordinates={locations}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    padding: 5,
  },
});
