import React from "react";
import { View, ActivityIndicator } from "react-native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

function Routes(){

    const isAuthenticated = false;
    const loading = false;

    if(loading){
        return(
            <View 
                style={{ 
                    flex:1, 
                    backgroundColor: '#f1f1f1', 
                    justifyContent:'center', 
                    alignItems:'center'
                }} 
            >
                <ActivityIndicator size={60} color='#3FBAC2' />
                
            </View>
        )
    }

    return(
        isAuthenticated ? <AppRoutes/> : <AuthRoutes/>
    )
}

export default Routes;