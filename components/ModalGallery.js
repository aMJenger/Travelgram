'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Modal,
    Image,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class ModalGallery extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            imageUri: this.props.navigation.getParam('imageUri'),
        }
    }

    static navigationOptions = {
        title: 'Image'
    };

    render() {
        return (
            <Modal
                transparent={false}
                animationType={'fade'}
                onRequestClose={() => {
                    this.props.navigation.navigate('Gallery', {storyName: this.props.navigation.getParam('storyName')});
                }}>
                <View style={styles.modelStyle}>
                    <Image
                        style={styles.fullImageStyle}
                        source={{uri: this.state.imageUri}}
                    />
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.closeButtonStyle}
                        onPress={() => {
                            this.props.navigation.navigate('Gallery', {storyName: this.props.navigation.getParam('storyName')});
                        }}>
                        <Icon name="times-circle" style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    fullImageStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '98%',
        resizeMode: 'contain',
    },
    modelStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
    },
    closeButtonStyle: {
        width: 25,
        height: 25,
        top: 9,
        right: 9,
        position: 'absolute',
    },
    icon: {
        color: "#fff",
        fontFamily: "roboto-regular",
        fontSize: 24,
        marginTop: 16,
    }
});