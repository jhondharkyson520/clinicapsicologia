import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Dashboard from "../../pages/Dashboard";

const Drawer = createDrawerNavigator();

const Menu = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        drawerContent={() => (
          <View style={styles.drawerContent}>
           
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.drawerItem}>Item do Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <Drawer.Screen name="Dashboard" component={Dashboard} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: "#313131",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerItem: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
  },
  hamburgerIcon: {
    marginLeft: 10,
  },
});

export default Menu;
