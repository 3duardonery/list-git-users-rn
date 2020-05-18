import styled from 'styled-components/native';
import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');

export const Container = styled.View`
  width: ${width};
  height: ${height};
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
`;
