import React, {Component} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import './config/ReactotronConfig';
import Routes from './routes';

export default class App extends Component {
  render() {
    return <Routes />;
  }
}
