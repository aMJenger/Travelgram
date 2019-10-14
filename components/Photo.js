'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PermissionsAndroid,
    Alert,
    Platform
} from 'react-native';

import {RNCamera} from 'react-native-camera';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import CameraRoll from "@react-native-community/cameraroll";
import AsyncStorage from "@react-native-community/async-storage";

export default class Photo extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            city: '',
            storyName: this.props.navigation.getParam('storyName'),
            pos: '',
        }
    }

    static navigationOptions = {
        title: 'Take a Photo'
    };

    getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const latitude = JSON.stringify(position.coords.latitude);
                const longitude = JSON.stringify(position.coords.longitude);
                let pos = {
                    lat: parseFloat(latitude),
                    lng: parseFloat(longitude)
                };
                this.setState({pos: pos});
                this.getCity(pos);
            },
            error => Alert.alert('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
    };

    getCity = (pos) => {
        Geocoder.geocodePosition(pos).then(res => {
            console.log(res[0].locality);
            this.setState({city: res[0].locality});
        })
            .catch(err => console.log(err))
    };

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    captureAudio={false}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                >
                    <View style={styles.viewCapture}>
                        <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                            <Text style={styles.photoButton}>SNAP</Text>
                        </TouchableOpacity>
                    </View>
                </RNCamera>
            </View>
        );
    }

    checkAndroidPermissionWriteExternalStorage = async () => {
        try {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            await PermissionsAndroid.request(permission);
            await Promise.resolve();
        } catch (error) {
            await Promise.reject(error);
        }
    };

    checkAndroidPermissionLocation = async () => {
        try {
            const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
            await PermissionsAndroid.request(permission);
            await Promise.resolve();
        } catch (error) {
            await Promise.reject(error);
        }
    };

    setData = async (imageInfoMap) => {
        try {
            await AsyncStorage.setItem(this.state.storyName, JSON.stringify([...imageInfoMap]));
            console.log('Data saved to AsyncStorage');
        } catch (error) {
            console.log('Failed to set Data in AsyncStorage ' + error.message);
        }
    };

    _delay(timer) {
        return new Promise(resolve => {
            timer = timer || 2000;
            setTimeout(function () {
                resolve();
            }, timer);
        });
    };

    waitTillLocationIsSet = async () => {
        while (this.state.city == '')
            await this._delay(500);
    };

    takePicture = async () => {
        if (this.camera) {
            const options = {quality: 0.5, base64: true};
            const data = await this.camera.takePictureAsync(options);
            if (Platform.OS === 'android') {
                await this.checkAndroidPermissionLocation();
            }
            this.getCurrentLocation();
            // wait for location
            await this.waitTillLocationIsSet();
            let imageInfoMap = new Map(this.props.navigation.getParam('imageInfoMap'));
            const {city} = this.state;
            let obj = {
                data: data,
                pos: this.state.pos
            };
            if (imageInfoMap.get(city) === undefined) {
                console.log("new City: " + city);
                imageInfoMap.set(city, [obj]);
            } else {
                console.log("City exist: " + city);
                let images = imageInfoMap.get(city);
                images.push(obj);
                imageInfoMap.delete(city);
                imageInfoMap.set(city, images);
            }
            this.setState({city: ''});
            console.log("Current photo taken: " + data.uri);
            if (Platform.OS === 'android') {
                await this.checkAndroidPermissionWriteExternalStorage();
            }
            await CameraRoll.saveToCameraRoll(data.uri);
            await this.setData(imageInfoMap);
            this.props.navigation.push('Gallery', {imageInfoMap: imageInfoMap, storyName: this.state.storyName});
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    photoButton: {
        fontSize: 20,
        textAlignVertical: 'center',
        textAlign: 'center',
        backgroundColor: '#3F51B5',
        color: 'white',
        borderRadius: 20,
        width: 75,
        height: 40
    },
    viewCapture: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

