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
    const img_str = await AsyncStorage.getItem("viewImage");
    if (img_str != null){
        setImage(JSON.parse(img_str));
    } else {
        router.push("/(tabs)/createpost");
    }
  }

  useEffect( ()=>{getImage()}, [])

  return (
    <View style={styles.container}>
        {
        <Image src={image["uri"]} style={styles.image} />
    }
    </View> 
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', padding: 16 },

  image: { width: '100%', height: '80%', marginBottom: 160, borderRadius: 8 },

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

