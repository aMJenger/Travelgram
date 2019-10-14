'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import AsyncStorage from "@react-native-community/async-storage";

export default class NewImageFromGallery extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            filePath: this.props.navigation.getParam('filePath'),
            imageInfoMap: new Map(this.props.navigation.getParam('imageInfoMap')),
            text: '',
            storyName: this.props.navigation.getParam('storyName'),
        }
    }

    static navigationOptions = {
        title: 'Add Image to Location...'
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.text}>Add Image to new Location...</Text>
                    <TextInput style={{marginHorizontal: 20}}
                               mode={"outlined"}
                               label='New Location'
                               value={this.state.text}
                               onChangeText={text => this.setState({text})}
                    />
                    <Button style={styles.buttonNewLocation} compact={true} mode="contained"
                            onPress={() => this.newCity()}>
                        Create new Location
                    </Button>

                    {this.buildButtons()}
                </ScrollView>
            </View>
        );
    }

    setData = (imageInfoMap) => {
        try {
            console.log(this.state.storyName);
            AsyncStorage.setItem(this.state.storyName, JSON.stringify([...imageInfoMap]));
            console.log('Data saved to AsyncStorage');
        } catch (error) {
            console.log('Failed to set Data in AsyncStorage ' + error.message);
        }
    };

    buildButtons = () => {
        let value = [];
        let buttonColor = true;
        if (this.state.imageInfoMap.size > 0) {
            value.push(
                <Text style={styles.text}>or choose from the Locations below...</Text>
            );
        }
        for (let key of this.state.imageInfoMap.keys()) {
            if (buttonColor) {
                value.push(
                    <Button style={styles.buttonLocationA} compact={true} mode="contained"
                            onPress={() => this.addImage(key)}>
                        {key}
                    </Button>);
                buttonColor = !buttonColor;
            } else {
                value.push(
                    <Button style={styles.buttonLocationB} compact={true} mode="outlined" onPress={() => this.addImage(key)}>
                        {key}
                    </Button>);
                buttonColor = !buttonColor;
            }
        }
        return value;
    };

    addImage = (key) => {
        const {imageInfoMap} = this.state;

        let images = imageInfoMap.get(key);
        let obj = {
            data: this.state.filePath,
            pos: {
                lat: null,
                lng: null
            }
        };
        images.push(obj);
        imageInfoMap.delete(key);
        imageInfoMap.set(key, images);
        this.setData(imageInfoMap);
        this.props.navigation.push('Gallery', {imageInfoMap: imageInfoMap, storyName: this.state.storyName});
    };

    newCity = () => {
        const {imageInfoMap} = this.state;
        let obj = {
            data: this.state.filePath,
            pos: {
                lat: null,
                lng: null
            }
        };
        imageInfoMap.set(this.state.text, [obj]);
        this.setState({text: ''});
        this.setData(imageInfoMap);
        this.props.navigation.push('Gallery', {imageInfoMap: imageInfoMap, storyName: this.state.storyName});

    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        color: '#3F51B5',
        padding: 10,
    },
    buttonNewLocation: {
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10
    },
    buttonLocationA: {
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10
    },
    buttonLocationB: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10
    }
});

