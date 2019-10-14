'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight, Alert,
} from 'react-native';
import Dialog from "react-native-dialog";
import {Text} from 'react-native-paper';
import FabPlus from "./FabPlus";
import AsyncStorage from '@react-native-community/async-storage';


export default class Home extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isDialogVisible: false,
            stories: [],
        };
        this.getData();
    }

    getData = async () => {
        try {
            let value = await AsyncStorage.getItem('storyName');
            if (value === null) {
                value = [];
                await AsyncStorage.setItem('storyName', JSON.stringify(value));
                this.setState({'stories': value});
                return;
            }
            value = JSON.parse(value);
            this.setState({'stories': value});
            console.log('Data get from AsyncStorage successfully');
        } catch (error) {
            console.log('Failed to get Data from AsyncStorage ' + error.message);
        }
    };

    setData = async () => {
        try {
            let data = this.state.stories;
            await AsyncStorage.setItem('storyName', JSON.stringify(data));
            console.log('Data saved to AsyncStorage');
        } catch (error) {
            console.log('Failed to set Data in AsyncStorage ' + error.message);
        }
    };

    static navigationOptions = {
        title: 'Welcome to Travelgram'
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.loadStories()}
                </ScrollView>
                <Dialog.Container contentStyle={{borderRadius: 20}} visible={this.state.isDialogVisible}>
                    <Dialog.Title>New Story</Dialog.Title>
                    <Dialog.Description>
                        Enter new Story Name:
                    </Dialog.Description>
                    <Dialog.Input placeholder='New Story Name' style={styles.input}
                                  onChangeText={(name) => this.setState({name: name})}/>
                    <Dialog.Button label="Cancel" onPress={() => this.isDialogVisible(false)}/>
                    <Dialog.Button label="Create" onPress={() => this.newStory(this.state.name)}/>
                </Dialog.Container>
                <FabPlus style={styles.fab} press={() => this.isDialogVisible(true)}/>
            </View>
        );
    }

    isDialogVisible = (input) => {
        this.setState({isDialogVisible: input})
    };

    newStory = async (inputText) => {
        let {stories} = this.state;
        stories.push(inputText);
        this.setState({stories: stories});
        this.setState({isDialogVisible: false});
        console.log(inputText);
        await this.setData();
        this.props.navigation.navigate('Gallery', {storyName: inputText});
    };

    loadStories = () => {
        let values = [];
        let buttonColor = true;
        if (this.state.stories.length > 0) {
            values.push(
                <Text style={styles.text}>Existing Stories...</Text>
            );
        }
        for (let key of this.state.stories) {
            if (buttonColor) {
                values.push(
                    <TouchableHighlight style={styles.highlightA}
                                        onLongPress={() => this.alertDeleteStory(key)}
                                        onPress={() => this.props.navigation.navigate('Gallery', {storyName: key})}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>{key}</Text>
                    </TouchableHighlight>);
                buttonColor = !buttonColor;
            } else {
                values.push(
                    <TouchableHighlight style={styles.highlightB}
                                        onLongPress={() => this.alertDeleteStory(key)}
                                        onPress={() => this.props.navigation.navigate('Gallery', {storyName: key})}>
                        <Text style={{color: '#3F51B5', fontWeight: 'bold', fontSize: 20}}>{key}</Text>
                    </TouchableHighlight>);
                ;
                buttonColor = !buttonColor;
            }
        }
        return values;
    };

    alertDeleteStory = (item) => {
        Alert.alert(
            //title
            'Delete Story',
            //body
            'Do you really want to delete this Story?',
            [
                {text: 'Yes', onPress: () => this.deleteStory(item)},
                {text: 'No', style: 'cancel'},
            ],
            {cancelable: true}
        );

    };

    deleteStory = async (item) => {
        let stories = this.state.stories;
        for (let i = 0; i < stories.length; i++) {
            if (stories[i] === item) {
                stories.splice(i, 1);
                this.setState({'stories': stories});
                await this.setData();
                await AsyncStorage.removeItem(item);
                this.props.navigation.push('Home');
            }
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 70,
        bottom: 20,
        right: 20,
        zIndex: 10,
    },
    input: {
        backgroundColor: 'grey',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        color: '#3F51B5',
        padding: 10,
    },
    highlightA: {
        backgroundColor: '#3F51B5',
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center'
    },
    highlightB: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderWidth: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center'
    }
});

