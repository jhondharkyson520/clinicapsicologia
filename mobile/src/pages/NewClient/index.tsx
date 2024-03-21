import { Text, View, Button } from "react-native";
import React, {useContext, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewClient(){


    return(
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Tela new client" />               
        </SafeAreaView>
    )
}