import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

import { Container } from './styles';

const { height, width } = Dimensions.get('window');

const Modal = ({show, close, text}) => {
  const [state, setState] = useState({
    opacity: new Animated.Value(0),
    container: new Animated.Value(height),
    modal: new Animated.Value(height),
  });

  const openModal = () => {
    Animated.sequence([
      Animated.timing(state.container, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(state.modal, {
        toValue: 0,
        bounciness: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.sequence([
      Animated.timing(state.modal, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(state.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(state.container, {
        toValue: height,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (show) {
      openModal();
    } else {
      closeModal();
    }
  }, [show]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: state.opacity,
          transform: [{translateY: state.container}],
          useNativeDriver: true,
        },
      ]}>
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{translateY: state.modal}],
            useNativeDriver: true,
          },
        ]}>
        <View style={styles.indicator} />
        <Text style={styles.text}>{text}</Text>

        <TouchableOpacity style={styles.btn} onPress={close}>
          <Text style={{color: '#fff'}}>Fechar</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
  },
  modal: {
    bottom: 1,
    position: 'absolute',
    height: '40%',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 25,
    paddingRight: 25,
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 10,
  },
  text: {
    marginTop: 30,
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#7159c1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  btnN: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default Modal;
