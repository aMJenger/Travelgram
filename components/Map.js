'use strict';
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps'

export default class Map extends PureComponent {

    static navigationOptions = {
        title: 'Google Maps'
    };

    render() {
        return (
            <View style={styles.container}>
                <MapView showsUserLocation={true} style={styles.map}>
                    {this.getMarkers()}
                </MapView>
            </View>
        );
    }

    getMarkers = () => {
        let value = [];
        let imageInfoMap = this.props.navigation.getParam('imageInfoMap');
        for (let key of imageInfoMap.keys()) {
            let obj = imageInfoMap.get(key);
            for (let pos of obj) {
                if (pos.pos.lat !== null && pos.pos.lng !== null) {
                    value.push(
                        <Marker coordinate={{latitude: pos.pos.lat, longitude: pos.pos.lng}}/>
                    );
                }
            }
        }
        return value;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    map: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }
});

