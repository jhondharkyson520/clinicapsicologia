import {View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

export default function App() {
  return (
    <NavigationContainer>      
      <StatusBar backgroundColor='#f1f1f1' barStyle='dark-content' translucent={false} />
      <Routes/>      
    </NavigationContainer>
  );
}
