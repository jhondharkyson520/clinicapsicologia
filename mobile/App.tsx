import 'react-native-gesture-handler'
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/app.routes';
import { AuthProvider } from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }}>       
          <StatusBar backgroundColor="#f1f1f1" barStyle="dark-content" translucent={false} />          
          <Routes />
          <Toast />
        </SafeAreaView>
      </AuthProvider>
    </NavigationContainer>
  );
}
