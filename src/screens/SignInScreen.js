import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text, Image, useWindowDimensions, ScrollView, Button} from "react-native"
import Logo from '../../assets/images/logo.png'
import CustomInput from "../components/CustomInput/CustomInput"
import CustomButon from "../components/CustomButton/CustomButton"
import CustomButton from "../components/CustomButton/CustomButton"
import * as firebase from "firebase/compat";
import {auth} from "../../firebase";


const SignInScreen = ({props,navigation}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    useEffect(() => {
        setUsername('kkiomen@kkiomen.pl')
        setPassword('kkiomen')
        const unsubscribe = auth.onAuthStateChanged(user =>{
            if(user){
                navigation.navigate('Dashboard')
            }
        })
        return unsubscribe
    },[])


    const onSignInPressed = () => {
        auth
            .signInWithEmailAndPassword(username, password)
            .then(userCredentials =>{
                const user = userCredentials.user
                console.log('Logged to' + user.email)
            })
            .catch(error => alert(error.message))
        console.log('Navigate to Dashboard')
    }

    const onSignUpPressed = () => {
        auth
            .createUserWithEmailAndPassword(username, password)
            .then(userCredentials =>{
                const user = userCredentials.user
                console.log(user.email)
            })
            .catch(error => alert(error.message))
        alert("Register done")
    }

    const addNewCompanies = () =>{
        navigation.navigate('Nim')
    }


    const {height} = useWindowDimensions();
    return (
        <ScrollView showsVericalScrollIndicator={false}>
            <View style={styles.root}>

                <Button
                    title='Dodaj nową firmę'
                    onPress={addNewCompanies}
                    color="black"
                    style={styles.buttonCreate}
                />

                <Image
                    source={Logo}
                    style={[styles.logo, {height: height * 0.3}]}
                    resizeMode="contain"
                />

                <CustomInput
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                />
                <CustomInput
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry
                />

                <CustomButton
                    text="Sign in"
                    onPress={onSignInPressed}
                />

                <CustomButton
                    text="Register"
                    onPress={onSignUpPressed}
                />


                <CustomButton
                    text="Register now"
                    onPress={onSignUpPressed}
                />

                <CustomButton
                    text="Forgot Password"
                    onPress={onSignInPressed}
                    type="TERTIARY"
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200
    }
});

export default SignInScreen;

