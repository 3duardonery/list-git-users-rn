import React, {Component} from 'react';

import {Keyboard, ActivityIndicator, View, Text, Button} from 'react-native';

import PropTypes from 'prop-types';

import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

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
    loading: false,
    showModal: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  async componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      await AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    console.tron.log(this.state.newUser);
    const {users, newUser} = this.state;

    this.setState({loading: true});

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    console.tron.log(data);

    this.setState({
      users: [...users, data],
      newUser: '',
      loading: false,
    });

    Keyboard.dismiss();
  };

  handleNavigate = (user) => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  handleShowProfile = () => {
    this.setState({showModal: true});
  };

  handleHideProfile = () => {
    this.setState({showModal: false});
  };

  render() {
    const {users, newUser, loading, showModal} = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar Usuário"
            value={newUser}
            onChangeText={(text) => this.setState({newUser: text})}
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
          renderItem={({item}) => (
            <User>
              <Avatar source={{uri: item.avatar}} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>

              <RemoveProfileButton onPress={() => {}}>
                <RemoveProfileButtonText>
                  Remover Usuário
                </RemoveProfileButtonText>
              </RemoveProfileButton>
            </User>
          )}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}>
          <Modal isVisible={showModal}>
            <View style={{ flex: 1 }}>
              <Text style={{color: '#fff'}}>I am the modal content!</Text>
              <Button title="Hide modal" onPress={this.handleHideProfile} />
            </View>
          </Modal>
        </View>
      </Container>
    );
  }
}
