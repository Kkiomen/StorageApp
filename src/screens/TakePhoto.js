import React, { useState, useRef, useEffect } from 'react';

import {
    StyleSheet,
    Dimensions,
    View,
    Text,
    TouchableOpacity, Platform
} from 'react-native';
import { Camera } from 'expo-camera';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import manageFileUpload from "../functions/manageFileUpload";
import getBlobFroUri from "../functions/getBlobFroUri";


const WINDOW_HEIGHT = Dimensions.get('window').height;
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

const TakePhotoScreen = ({props,navigation}) => {
    const cameraRef = useRef();
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [isPreview, setIsPreview] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null)


    const [imgURI, setImageURI] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [remoteURL, setRemoteURL] = useState("");
    const [error, setError] = React.useState(null);

    useEffect(() => {
        onHandlePermission();
    }, []);

    const onHandlePermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    const switchCamera = () => {
        if (isPreview) {
            return;
        }
        setCameraType(prevCameraType =>
            prevCameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const onStart = () => {
        setIsUploading(true);
    };

    const onProgress = (progress) => {
        setProgress(progress);
    };
    const onComplete = (fileUrl) => {
        setRemoteURL(fileUrl);
        setIsUploading(false);
        setImageURI(null);
    };

    const onFail = (error) => {
        setError(error);
        setIsUploading(false);
    };



    const onSnap = async ( { onStart, onProgress, onComplete, onFail }) => {
        if (cameraRef.current) {
            await cameraRef.current.pausePreview();
            setIsPreview(true);
            const options = {quality: 0.7, base64: true};
            const photo = await cameraRef.current.takePictureAsync(options);
            setCapturedImage(photo)
            const uri = photo.uri
            const blob = await getBlobFroUri(uri);

            await manageFileUpload(blob, {onStart, onProgress, onComplete, onFail});
        }
        return false;
    };

//
    const cancelPreview = async () => {
        await cameraRef.current.resumePreview();
        setIsPreview(false);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text style={styles.text}>No access to camera</Text>;
    }






    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={styles.container}
                type={cameraType}
                onCameraReady={onCameraReady}
                useCamera2Api={true}
            />
            <View style={styles.container}>
                {isPreview && (
                    <TouchableOpacity
                        onPress={cancelPreview}
                        style={styles.closeButton}
                        activeOpacity={0.7}
                    >
                        <AntDesign name='close' size={32} color='#fff' />
                    </TouchableOpacity>
                )}
                {!isPreview && (
                    <View style={styles.bottomButtonsContainer}>
                        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
                            <MaterialIcons name='flip-camera-ios' size={28} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={!isCameraReady}
                            onPress={onSnap}
                            style={styles.capture}
                        />
                    </View>
                )}
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    text: {
        color: '#fff'
    },
    bottomButtonsContainer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 28,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: 35,
        right: 20,
        height: 50,
        width: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5A45FF',
        opacity: 0.7
    },
    capture: {
        backgroundColor: '#5A45FF',
        height: CAPTURE_SIZE,
        width: CAPTURE_SIZE,
        borderRadius: Math.floor(CAPTURE_SIZE / 2),
        marginBottom: 28,
        marginHorizontal: 30
    },
});


export default TakePhotoScreen;
