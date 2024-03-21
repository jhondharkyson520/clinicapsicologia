import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "../pages/Dashboard";
import NewClient from "../pages/NewClient";

const Drawer = createDrawerNavigator();

export default function AppRoutes() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#9728ad'
          },
          drawerStyle: {
            backgroundColor: '#9728ad'
          },
          drawerActiveTintColor: '#fff',
          drawerInactiveTintColor: '#f1f1f1',
          drawerLabelStyle: {
            fontSize: 18
          }
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name="NewClient"
          component={NewClient}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
