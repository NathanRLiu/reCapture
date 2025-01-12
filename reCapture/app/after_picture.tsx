import React, { useEffect, useState } from 'react';
import { PressableOpacity } from 'react-native-pressable-opacity'
import { StyleSheet, Text, TextInput, Image, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from "expo-constants";
const { manifest } = Constants;
import IonIcon from 'react-native-vector-icons/Ionicons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";

const b64toBlob = (base64:string, type = 'application/octet-stream') => 
  fetch(`data:${type};base64,${base64}`).then(res => res.blob())

export default function AfterPicturePage() {
  const router = useRouter();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState({"base64": "", "uri":"", "name": "", "type": ""});
  const getImage = async ()=>{
    const img_str = await AsyncStorage.getItem("image");
    if (img_str != null){
        setImage(JSON.parse(img_str));
    } else {
        router.push("/(tabs)/createpost");
    }
  }

  useEffect( ()=>{getImage()}, [])

  const submitPost = async () => {
    if (image == null) {
        router.push("/(tabs)/map");
    } else {
        const currentLocation = await Location.getCurrentPositionAsync({});
    
        var form = new FormData();
        const base64 = image["base64"];
        const email = await AsyncStorage.getItem("email");
        form.append("image", base64);
        form.append("lat", currentLocation.coords.latitude.toString());
        form.append("lon", currentLocation.coords.longitude.toString());
        form.append("username", email == null ? "NULL":email); // here
        form.append("caption", "");

        const uri = `https://85f8-169-231-176-250.ngrok-free.app`;

        const response = await fetch(uri + '/api/upload/', {
            method: 'POST',
            body: form,
            headers: {
                "Content-Type": "application/octet-stream"
              },
          });
        
        router.push('/(tabs)/map');
    }
  };
  return (
    <View style={styles.container}>
        {
        <Image src={image["uri"]} style={styles.image} />
    }
        <PressableOpacity style={styles.button} onPress={()=>{submitPost()}} disabledOpacity={1} activeOpacity={.8}>
            <Text> Post </Text>
        </PressableOpacity>

    </View> 
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', padding: 16 },

  image: { width: '100%', height: '70%', marginBottom: 160, borderRadius: 8 },

  input: { width: '100%', height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 16, color: 'white', 
    backgroundColor: '#222' },
    buttonRow: { flexDirection: 'row',
         justifyContent: 'space-between', 
         width: '50%' },
    button: 
  { width: 150, 
    height: 40,
     borderRadius: 10, 
     backgroundColor: 'rgba(240, 240, 240, 1.0)', 
    justifyContent: 'center', 
    alignItems: 'center' },
  emptyContainer: { flex: 1, 
    justifyContent: 'center',
     alignItems: 'center', 
     backgroundColor: '#000' },
  message: 
  { color: 'white', fontSize: 18, marginBottom: 16 },
  buttonText: { color: 'white', fontSize: 16 },
});

