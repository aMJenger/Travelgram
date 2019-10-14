'use strict';
import React, {PureComponent} from 'react';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from "./components/Home";
import Photo from "./components/Photo";
import ModalGallery from "./components/ModalGallery";
import Gallery from "./components/Gallery";
import NewImageFromGallery from "./components/NewImageFromGallery";
import Map from "./components/Map";
import { fadeIn } from 'react-navigation-transitions'

const MainNavigator = createStackNavigator({
        Home: {screen: Home},
        Photo: {screen: Photo},
        Modal: {screen: ModalGallery},
        Gallery: {screen: Gallery},
        NewImageFromGallery: {screen: NewImageFromGallery},
        Map: {screen: Map},
    },
    {
        initialRouteName: 'Home',
        transitionConfig: () => fadeIn(),
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#3F51B5',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    });

const AppContainer = createAppContainer(MainNavigator);

export default class App extends PureComponent {

    render() {
        return (
            <AppContainer/>
        );
    }
}
