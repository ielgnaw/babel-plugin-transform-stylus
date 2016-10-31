/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View} from 'react-native';
import styles from './css/test.styl';

export default class example extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.container_welcome}>
                    Welcome to React Native!3
                </Text>
                <Text style={styles.container_instructions}>
                    To get started, edit index.ios.js
                </Text>
                <Text style={styles.container_instructions}>
                    Press Cmd+R to reload,{'\n'}
                    Cmd+D or shake for dev menu
                </Text>
            </View>
        );
    }
}

AppRegistry.registerComponent('example', () => example);
