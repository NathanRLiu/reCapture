import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View ,Alert} from 'react-native';
import { PressableOpacity } from 'react-native-pressable-opacity'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraPage() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraView = React.useRef<CameraView>(null);
  const router = useRouter();
  const takePic = async ()=>{
    try {
        if (cameraView.current != null) {
            const photo = await cameraView.current.takePictureAsync({base64:true, quality:0.3});
            await AsyncStorage.setItem("image", JSON.stringify(photo));
            router.push("/after_picture");
        }
    } catch (e) {
        console.log(e);
    }
  }

  useEffect(()=>{
    if (permission && !permission.granted) {
        requestPermission();
    }
  }, [permission])

  if (!permission) {
    return <View />;
  }
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const toggleFlashMode = () => {
    setFlashMode(flashMode === 'on'?'off':'on');
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} flash={flashMode} ref={cameraView}>
        <View style={styles.buttonContainer}>
            <View style={styles.rightButtonRow}>
                <PressableOpacity style={styles.button} onPress={toggleCameraFacing} disabledOpacity={0.8}>
                    <IonIcon name="camera-reverse" color="white" size={50} />
                </PressableOpacity>
                {'supportsFlash' && (
                <PressableOpacity style={styles.button} onPress={()=>{
                    toggleFlashMode();
                }} disabledOpacity={0.5}>
                <IonIcon name={flashMode ==='on' ? 'flash' : 'flash-off'} 
                    color="white" size={50} />
                </PressableOpacity>
                

                )}
                <PressableOpacity style={styles.button} onPress={takePic} disabledOpacity={0.5}>
                    <IonIcon name="camera" color="white" size={50} />
                </PressableOpacity>
            </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: "20%",
  },
  button: {
    marginBottom: "2%",
    width: 50,
    height: 50,
    borderRadius: 30 / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: "5%",
    top: "20%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
