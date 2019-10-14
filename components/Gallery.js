'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Image,
    Alert,
    Text,
    View,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import {SectionGrid} from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FabCamera from "./FabCamera.js";
import ImagePicker from "react-native-image-picker";
import AsyncStorage from "@react-native-community/async-storage";
import {HeaderBackButton} from "react-navigation-stack";

export default class Gallery extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            city: '',
            imageInfoMap: new Map(this.props.navigation.getParam('imageInfoMap')),
            storyName: this.props.navigation.getParam('storyName'),
        };
        this.getData();
    }

    componentDidMount() {
        this.props.navigation.setParams({handleGallery: this.chooseFile.bind(this)});
        this.props.navigation.setParams({handleMaps: this.goToMaps.bind(this)});
    }

    goToMaps() {
        this.props.navigation.navigate('Map', {imageInfoMap: this.state.imageInfoMap});
    }

    getData = async () => {
        try {
            let value = await AsyncStorage.getItem(this.state.storyName);
            if (value === null) {
                value = new Map();
                await AsyncStorage.setItem(this.state.storyName, JSON.stringify([...value]));
                this.setState({'stories': value});
                return;
            }
            value = new Map(JSON.parse(value));
            this.setState({'imageInfoMap': value});
            console.log('Data get from AsyncStorage successfully');
        } catch (error) {
            console.log('Failed to get Data from AsyncStorage ' + error.message);
        }
    };

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: 'Gallery',
            headerRight: (<View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={{paddingRight: 20}} onPress={() => params.handleMaps()}>
                    <Icon name="map-marked" style={styles.iconMap}/>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingRight: 10}} onPress={() => params.handleGallery()}>
                    <Icon name="images" style={styles.iconGallery}/>
                </TouchableOpacity>
            </View>),
            headerLeft: (<HeaderBackButton tintColor={'#fff'} onPress={() => {
                navigation.navigate('Home')
            }}/>)
        };
    };

    render() {
        return (
            <View style={styles.container}>
                <FabCamera style={styles.fab} press={() => this.props.navigation.navigate('Photo', {
                    imageInfoMap: this.state.imageInfoMap,
                    storyName: this.state.storyName
                })}/>
                {this.buildGallery()}
            </View>
        );
    }

    buildGallery = () => {
        let value = [];
        let sections = [];
        for (let key of this.state.imageInfoMap.keys()) {
            let item = {
                title: key,
                data: this.state.imageInfoMap.get(key),
            };
            sections.push(item);
        }
        value.push(<SectionGrid
            itemDimension={130}
            sections={sections}
            style={styles.gridView}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, section, index}) => (
                <TouchableHighlight
                    onLongPress={() => this.alertDeleteImage(item)}
                    onPress={() => this.props.navigation.navigate('Modal', {
                        imageUri: item.data.uri,
                        storyName: this.state.storyName
                    })}>
                    <Image
                        style={styles.itemContainer}
                        source={{uri: item.data.uri}}
                    />
                </TouchableHighlight>
            )}
            renderSectionHeader={({section}) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
        />);
        return value;
    };

    alertDeleteImage = (item) => {
        Alert.alert(
            //title
            'Delete Image',
            //body
            'Do you really want to delete this Image?',
            [
                {text: 'Yes', onPress: () => this.deleteImage(item)},
                {text: 'No', style: 'cancel'},
            ],
            {cancelable: true}
        );

    };

    deleteImage = async (item) => {
        let imageInfoMap = this.state.imageInfoMap;
        for (let obj of imageInfoMap.keys()) {
            let val = imageInfoMap.get(obj);
            for( let i = 0; i < val.length; i++){
                if ( val[i] === item) {
                    val.splice(i, 1);
                    imageInfoMap.delete(obj);
                    if(val.length!=0)
                    {
                        imageInfoMap.set(obj, val);
                    }
                    await this.setData(imageInfoMap);
                    this.props.navigation.push('Gallery', {imageInfoMap: imageInfoMap, storyName: this.state.storyName});
                }
            }

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

    chooseFile() {
        let options = {
            title: 'Select Image',
            customButtons: [
                {name: 'customOptionKey', title: 'Choose Image from Gallery'},
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, response => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source = {uri: 'file://' + response.path};
                let {imageInfoMap} = this.state;
                this.props.navigation.push('NewImageFromGallery', {
                    imageInfoMap: imageInfoMap,
                    filePath: source, storyName: this.state.storyName
                });
            }
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    icon: {
        color: "#fff",
        fontFamily: "roboto-regular",
        fontSize: 24,
        alignSelf: "center"
    },
    gridView: {
        marginTop: 20,
        flex: 1,
        zIndex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
        zIndex: 1,
    },
    sectionHeader: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        alignItems: 'center',
        backgroundColor: '#3F51B5',
        color: 'white',
        padding: 10,
        zIndex: 1,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 70,
        bottom: 20,
        right: 20,
        zIndex: 100,
    },
    iconMap: {
        color: "#fff",
        fontFamily: "roboto-regular",
        fontSize: 24,
        alignSelf: "center",
    },
    iconGallery: {
        color: "#fff",
        fontFamily: "roboto-regular",
        fontSize: 24,
        alignSelf: "center",
    }
});

