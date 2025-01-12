import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // const [polygonCoords, setPolygonCoords] = useState<Array<Array<{latitude: number, longitude: number}>>>([]);
  const [trialtriangle, setTrial] = useState<Array<{latitude: number, longitude: number}>>([]);
  let polygonCoords: Array<Array<{latitude: number, longitude: number}>> = [];
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

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

  // Update polygons whenever location changes
  useEffect(() => {
    if (location) {
      updatePolygons();
    }
  }, [location]);

  const createArray = (i: number, j: number, step: number): number[] => {
    return Array.from(
      { length: Math.floor((j - i) / step) + 1 },
      (_, index) => i + index * step
    );
  };

  const invis = () => {
    setTrial(trialtriangle.length > 0 ? [] : [
      {latitude: location?.coords.latitude! - 0.0075, longitude: location?.coords.longitude!},
      {latitude: location?.coords.latitude! + 0.0075, longitude: location?.coords.longitude!},
      {latitude: location?.coords.latitude!, longitude: location?.coords.longitude! + 0.001}
    ]);
  }

  const updatePolygons = () => {
    if (!location) return;

    const lat = location.coords.latitude;
    const lon = location.coords.longitude;

    const i_top = lat + 0.5;
    const i_bot = lat - 0.5;
    const j_left = lon - 0.5;
    const j_right = lon + 0.5;

    const long = createArray(i_bot, i_top, 0.01);
    const lat1 = createArray(j_left, j_right, 0.01);
    const lat2 = createArray(j_left - 0.0025, j_right, 0.01);
    // setPolygonCoords([]);

    const newPolygonCoords: Array<Array<{latitude: number, longitude: number}>> = [];

    for (let i = 0; i < long.length - 1; i++) {
      const lat_t = i % 2 === 0 ? lat1 : lat2;
      const lat_b = i % 2 === 1 ? lat1 : lat2;
      
      for (let j = 0; j < Math.min(lat_t.length - 1, lat_b.length - 1); j++) {
        // First triangle
        polygonCoords.push([
          { latitude: lat_t[j], longitude: long[i] },
          { latitude: lat_t[j + 1], longitude: long[i] },
          { latitude: lat_b[j], longitude: long[i + 1] }
        ]);
        
        // Second triangle
        polygonCoords.push([
          { latitude: lat_t[j + 1], longitude: long[i] },
          { latitude: lat_b[j], longitude: long[i + 1] },
          { latitude: lat_b[j + 1], longitude: long[i + 1] }
        ]);
      }
    }

    // console.log(newPolygonCoords);

    // setPolygonCoords(newPolygonCoords);
  };

  const region = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : null;

  const locations = [];
  let l = location ? location.coords.latitude - 5*0.001 : 0;
  let r = location ? location.coords.longitude - 5*0.001 : 0;
  let i = 0;
  while (i < 10){
    let j = 0;
    let l_r = l;
    while (j < 10){

      locations.push([
        { latitude: l_r, longitude: r},
        { latitude: l_r+0.001, longitude: r},
        { latitude: l_r+0.001, longitude: r+0.001},
        { latitude: l_r, longitude: r+0.001}
      ]);

      l_r += 0.001;
      j++;
    }
    r+=0.001
    i++;
  }
  // console.log(locations);

  // const shitter = [[]];
  updatePolygons();

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={true}
          minZoomLevel={15}
          maxZoomLevel={17}
          // onRegionChangeComplete={updatePolygons}
        >
          {/* <Polygon
              // key={`polygon-${index}`}
              strokeColor="red"
              fillColor="rgba(255, 0, 0, 0.2)"
              coordinates={locations}
            /> */}
          {locations.map((triangle, index) => (
            <Polygon
              key={`polygon-${index}`}
              strokeColor="red"
              fillColor="rgba(255, 0, 0, 0.2)"
              coordinates={triangle}
            />
          ))}
          <Polygon
              // key={`polygon-${index}`}
              strokeColor="blue"
              fillColor="rgba(255, 0, 0, 0.2)"
              coordinates={trialtriangle}
          /> 
          
          {locations[0].map((loc, index) => (
            <Marker
              key={`marker-${index}`}
              coordinate={loc}
              title={`Location ${index + 1}`}
            />
          ))}
        </MapView>
      ) : (
        <Text style={styles.paragraph}>
          {errorMsg || "Loading your location..."}
        </Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/createpost")}
      >
        <Ionicons name="add-circle" size={60} color="blue" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton1}
        onPress={invis}
      >
        <Ionicons name="add-circle" size={60} color="red" />
      </TouchableOpacity>
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
    bottom: 100,
    right: 100,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    padding: 5,
  },
  addButton1: {
    position: "absolute",
    bottom: 100,
    right: 200,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    padding: 5,
  },
});