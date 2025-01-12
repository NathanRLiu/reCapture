import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker, Polygon, Circle } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";


/*
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Here pin',
    body: 'Check it out ',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
*/
/*
function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}
*/
export default function HomeScreen() {
  /*
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  */

  //const [pins, setPins] = useState([]);
/*
  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch('../backend/routes/upload'); 
        const data = await response.json();
        setPins(data);
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    }
    fetchMarkers();
  }, []);
  */
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [ pins, setPins ] = useState([{}]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(()=>{
    (async ()=> {
      const uri = `https://85f8-169-231-176-250.ngrok-free.app`;
      const res = await fetch(uri + "/api/query/");
      setPins(await res.json());
    })()
  }, [])
  /*
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

*/

  //updating location
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // temp (holy circle)
  const [trialtriangle, setTrial] = useState<
    { latitude: number; longitude: number }
  >({latitude: 0, longitude: 0});
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // Resetting holes
  const [allHoles, setAllHoles] = useState<Array<Array<{latitude: number, longitude: number}>>>([]);
  let allHolesR = new Set<{latitude: number, longitude: number}>; // just for local

  //Updating the current location
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

const showAlert = (imageURL:string) =>
  Alert.alert(
    'Check it out!',
    'One of your friends was here a few days ago. Wanna see what they posted?',
    [
      {
        text: 'Yes',
        onPress: () => {
          AsyncStorage.setItem("viewImage", imageURL)
          router.push("/view_post");
        },
        style: 'default',
      },
      {
        text: 'No',
        onPress: () => {},
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () => {}
    },
  );


Location.watchPositionAsync(
  {
    accuracy: Location.Accuracy.BestForNavigation,
    timeInterval: 10000,
    // distanceInterval: 5,  
  },
  async (loc) => {
    pins.forEach((pin:any)=>{
      if (lon in pin && lat in pin){
        const dist = Math.sqrt((pin["lon"] - loc.coords.longitude)**2 + (pin["lat"] - loc.coords.latitude)**2 )
        console.log(dist);
        if (dist < 0.001) {
          showAlert("https://85f8-169-231-176-250.ngrok-free.app/img/" + pin.image_path);
        }
      }
    })
  }
)

  //Freezing first location and length diff for lat and long
  const lat = location?.coords.latitude!;
  const lon = location?.coords.longitude!;
  const length = 0.01;

//  let push = Location.watchPositionAsync(
//    {
//      accuracy: Location.Accuracy.BestForNavigation,
//      timeInterval: 5000,
//      // distanceInterval: 5,  
//     },
//    (loc) => {
//      console.log("Testing this guy");
//      Notifications.presentNotificationAsync({
//        title: 'Look at that notification',
//        body: "I'm so proud of myself!",
//      });
//    })

  // makes the hole bigger by distance travelled
  const addHole = () => {
    let tempAH: Array<Array<{ latitude: number; longitude: number }>> = [];
    // if (allHolesR){
    //   for (var a of allHolesR){
    //     if (Number.isInteger(a.latitude)){
    //       allHolesR.add(a);
    //     }
    //   } 
    // }
    
    let c_lat = location?.coords.latitude!;
    let c_lon = location?.coords.longitude!;

    c_lat -= lat;
    c_lon -= lon;
    c_lat = c_lat == 0 ? 1 : c_lat;
    c_lon = c_lon == 0 ? 1 : c_lon;
    c_lat /= length;
    c_lon /= length; 
    c_lat = Math.round(c_lat);
    c_lon = Math.round(c_lon);
    
    if (Number.isInteger(c_lat)) {
      allHolesR.add({latitude: c_lat, longitude: c_lon});
    }
    let center = {latitude: c_lat, longitude: c_lon}
    center.latitude = (center.latitude*length)+lat;
    center.longitude = (center.longitude*length)+lon;
    // console.log(center, radius);
    // Create 4 corners from center point
    setAllHoles(([...allHolesR].map(center => [
      // Top-left
      {
        latitude: center.latitude + length/2,
        longitude: center.longitude - length/2
      },
      // Top-right
      {
        latitude: center.latitude + length/2,
        longitude: center.longitude + length/2
      },
      // Bottom-right
      {
        latitude: center.latitude - length/2,
        longitude: center.longitude + length/2
      },
      // Bottom-left
      {
        latitude: center.latitude - length/2,
        longitude: center.longitude - length/2
      }
    ])));
    

    // resAllHoles(convertCenterToCorners([...allHolesR], length/2));
  }
  
  const createArray = (i: number, j: number, step: number): number[] => {
    return Array.from(
      { length: Math.floor((j - i) / step) + 1 },
      (_, index) => i + index * step
    );
  };

  const invis = () => {
    setTrial(
      trialtriangle.latitude > 0
        ? {
            latitude: 0,
            longitude: 0,
          }
        :
            {
              latitude: location?.coords.latitude!,
              longitude: location?.coords.longitude!,
            }
    );
  };

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : null;

  // console.log(locations);

  //const images = [];


  // updatePolygons();
  function convertCenterToCorners(centerPoints: Array<{ latitude: number; longitude: number }>, radius: number): Array<Array<{ latitude: number; longitude: number }>> {
    return centerPoints.map(center => {
      center.latitude = (center.latitude*length)+lat;
      center.longitude = (center.longitude*length)+lon;
      // console.log(center, radius);
      // Create 4 corners from center point
      return [
        // Top-left
        {
          latitude: center.latitude + radius,
          longitude: center.longitude - radius
        },
        // Top-right
        {
          latitude: center.latitude + radius,
          longitude: center.longitude + radius
        },
        // Bottom-right
        {
          latitude: center.latitude - radius,
          longitude: center.longitude + radius
        },
        // Bottom-left
        {
          latitude: center.latitude - radius,
          longitude: center.longitude - radius
        }
      ];
    });
  }
``

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
          onRegionChangeComplete={addHole}
        >
          <Polygon
            strokeColor="darkred"
            fillColor="rgba(250, 0, 0, 0.0)"
            coordinates={[
              { latitude: lat - 0.1, longitude: lon - 0.1},
              { latitude: lat + 0.1, longitude: lon - 0.1},
              { latitude: lat + 0.1, longitude: lon + 0.1 },
              { latitude: lat - 0.1, longitude: lon + 0.1 },
            ]
            }
            holes={allHoles}
          />
          <Circle
            // key={`polygon-${index}`}
            fillColor="rgba(255, 255, 255, 0)"
            strokeColor="rgba(0, 0, 0, 0.6)"
            center={trialtriangle}
            radius={500}
            strokeWidth={400}
          />
          {/* <Circle
            // key={`polygon-${index}`}
            strokeColor="darkred"
            fillColor="rgba(255, 0, 0, 0.3)"
            center={trialtriangle}
            radius={130}
          />
          <Circle
            // key={`polygon-${index}`}
            strokeColor="darkred"
            fillColor="rgba(255, 0, 0, 0.4)"
            center={trialtriangle}
            radius={200}
          /> */}
          

          {pins.map((loc:any, index:any) => (
            <Marker
              key={`marker-${index}`} 
              coordinate={{latitude: loc['lat'], longitude : loc['lon']}}
              // caption={'test'}
              title = {'my loc'}
              onPress={() => {
                console.log("https://85f8-169-231-176-250.ngrok-free.app/static/" + loc['image_path'])
                showAlert("https://85f8-169-231-176-250.ngrok-free.app/static/" + loc['image_path'])
              }}
              />
              
          ))}
          {/* {selectedMarker && (
          <View style={styles.imageOverlay}>
            <Image source={selectedMarker.image} style={styles.image} />
          </View>
          )} */}

        </MapView>
      ) : (
        <Text style={styles.paragraph}>
          {errorMsg || "Loading your location..."}
        </Text>
      )}

      {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/(tabs)/createpost")}
      >
        <Ionicons name="add-circle" size={60} color="blue" />
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.addButton1} onPress={() => {
        invis();
        // sendPushNotification(expoPushToken);
      }}>
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
  imageOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
  },
});
