import React, {Component} from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FabCamera extends Component {
    render() {
        return (
            <TouchableOpacity style={[styles.container, this.props.style]} onPress={this.props.press}>
                <Icon name="camera" style={styles.icon}/>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3F51B5",
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
        minWidth: 75,
        minHeight: 75,
        borderRadius: 100,
        shadowOffset: {
            height: 2,
            width: 0
        },
        shadowColor: "#111",
        shadowOpacity: 0.2,
        shadowRadius: 1.2
    },
    icon: {
        color: "#fff",
        fontFamily: "roboto-regular",
        fontSize: 24,
        alignSelf: "center"
    }
});
