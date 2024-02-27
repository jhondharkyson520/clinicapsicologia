import React, {useState, useContext, useEffect} from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Keyboard, ActivityIndicator, Alert } from "react-native";
import * as Animatable from 'react-native-animatable';
import { AuthContext } from "../../contexts/AuthContext";
import Toast from "react-native-toast-message";


export default function SignIn(){
    const { signIn, loadingAuth } = useContext(AuthContext)

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    async function handleLogin(){
        
        if( email === '' || password === '' ){
            return(
                Toast.show({
                    type: 'error',
                    text1: 'Preencha todos os campos!',
                    position: 'top',
                })
            );
        }

        const signInSuccess = await signIn({email, password});
    
        if (!signInSuccess) {
            Toast.show({
                type: 'error',
                text1: 'Usuário ou senha incorretos!',
                position: 'top',
            });
        }
    }

    return(

        <View style={styles.container} >
            {!keyboardVisible && (
            <Animatable.View animation='fadeInLeft' delay={500} style={styles.containerHeader}>
                <Text style={styles.message}>Bem vindo(a)!</Text>
            </Animatable.View>
            )}

            <Animatable.View animation='fadeInUp' style={styles.containerForm}>

                <Image
                    style={styles.logo}
                    source={require('../../assets/logosgcp.png')}
                />

                <Text style={styles.title}>Email</Text>
                <TextInput
                    placeholder="Digite seu email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <Text style={styles.title}>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha"
                    style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} >
                    { loadingAuth ? (
                        <ActivityIndicator size={25} color='#f1f1f1' />
                    ) : (
                        <Text style={styles.buttonText}>Acessar</Text>
                    )}
                    
                </TouchableOpacity>

            </Animatable.View>
        </View>

    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#3FBAC2'
    },
    containerHeader:{
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },
    message:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f1f1f1'
    },
    containerForm:{
        backgroundColor: '#f1f1f1',
        flex: 1,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%',
        paddingTop: '10%'
    },
    logo:{
        marginBottom: 18,
        marginLeft: '22%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontSize: 20,
        marginTop: 28
    },
    input:{
        borderBottomWidth: 1,
        height: 40,
        marginBottom: 12,
        fontSize: 16
    },
    button:{
        backgroundColor: '#3FBAC2',
        width: '100%',
        borderRadius: 4,
        paddingVertical: 8,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#f1f1f1',
        fontSize: 18,
        alignSelf: 'center'
    }
})