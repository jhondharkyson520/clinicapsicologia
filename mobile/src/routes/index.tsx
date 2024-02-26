import React, { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { AuthContext } from "../contexts/AuthContext";

function Routes(){

    const { isAuthenticated } = useContext(AuthContext);
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