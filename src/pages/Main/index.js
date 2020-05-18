import React, { Component, useState } from 'react';

import {
  Keyboard,
  ActivityIndicator,
  View,
  Text,
  Button,
} from 'react-native';

import PropTypes from 'prop-types';

// import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

import ModalConfirmation from '../../components/ModalConfirmation';
import Modal from '../../components/Modal';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveProfileButton,
  RemoveProfileButtonText,
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    title: 'Usuários',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    removeUser: {},
    loading: false,
    showModal: false,
    showError: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  async componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  async removeUserFromLoacalStorage(user) {
    const { users } = this.state;

  }

  handleAddUser = async () => {
    try {
      const { users, newUser } = this.state;

      this.setState({ loading: true });

      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
      });
    } catch (error) {
      console.tron.log(error);
      this.setState({loading: false, showError: true});
    }

    Keyboard.dismiss();
  };

  handleNavigate = (user) => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  handleShowProfile = async (user) => {
    this.setState({ removeUser: user, showModal: true });
  };

  handleHideProfile = () => {
    this.setState({ showModal: false, showError: false });
  };

  handleRemoveUserConfirm = () => {
    const { users, removeUser } = this.state;

    let index = users.findIndex(x => x.login == removeUser.login);
    users.splice(index, 1);

    this.setState({ showModal: false, users: users });
    AsyncStorage.setItem('users', JSON.stringify(users));
  };

  render() {
    const {
      users,
      newUser,
      loading,
      showModal,
      showError,
      removeUser,
    } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            onChangeText={(text) => this.setState({ newUser: text })}
            returnKeyType="done"
            onSubmit={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
                <Icon name="add" size={20} color="#FFF" />
              )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={(user) => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>

              <RemoveProfileButton onPress={() => this.handleShowProfile(item)}>
                <RemoveProfileButtonText>
                  Remover Usuário
                </RemoveProfileButtonText>
              </RemoveProfileButton>
            </User>
          )}
        />

        <ModalConfirmation
          show={showModal}
          close={this.handleHideProfile}
          text={'Deseja apagar esse registro?'}
          confirm={this.handleRemoveUserConfirm}
        />
        <Modal
          show={showError}
          close={this.handleHideProfile}
          text={'Nenhum usuário foi encontrado.'}
        />
      </Container>
    );
  }
}
