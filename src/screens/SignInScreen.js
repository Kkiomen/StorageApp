import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text, Image, useWindowDimensions, ScrollView, Button} from "react-native"
import Logo from '../../assets/images/logo.png'
import CustomInput from "../components/CustomInput/CustomInput"
import CustomButon from "../components/CustomButton/CustomButton"
import CustomButton from "../components/CustomButton/CustomButton"
import * as firebase from "firebase/compat";
import {auth} from "../../firebase";
import CustomHeaderForm from "../components/CustomHeaderForm/CustomHeaderForm";


const SignInScreen = ({props,navigation}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [orderCode, setOrderCode] = useState('')


    useEffect(() => {
        setUsername('kkiomen@kkiomen.pl')
        setPassword('kkiomen')
        setOrderCode("sZY2j7u7MdwFUbzVN9aD")
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
            })
            .catch(error => alert(error.message))
    }

    const onSignUpPressed = () => {
       // navigation.navigate('CarrierInformation');

        auth
            .createUserWithEmailAndPassword(username, password)
            .then(userCredentials =>{
                const user = userCredentials.user
                console.log(user.email)
            })
            .catch(error => alert(error.message))
        // alert("Register done")
    }
    const onCarrierInfoPressed = () =>{
        const db = firebase.firestore();
        const orderKey = orderCode;
        let result = undefined;
        db.collection('orders').doc(orderKey).get().then((order) => {
            result = order.data();
        });
        if(result !== undefined){
            navigation.navigate('CarrierInformation', {orderKey: orderCode});
        }else{
            alert('No such order exists')
        }

    }

    const addNewCompanies = () =>{
        navigation.navigate('Nim')
    }


    const {height} = useWindowDimensions();
    return (
        <ScrollView showsVericalScrollIndicator={false}>
            <View style={styles.root}>
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

                <CustomHeaderForm
                    title="Or enter order code to check  information"
                />


                <CustomInput
                    placeholder="Order code"
                    value={orderCode}
                    setValue={setOrderCode}
                />

                <CustomButton
                    text="Log in as a driver"
                    onPress={() =>onCarrierInfoPressed()}
                />


                {/*<CustomButton*/}
                {/*    text="Register"*/}
                {/*    onPress={onSignUpPressed}*/}
                {/*/>*/}


                {/*<CustomButton*/}
                {/*    text="Register now"*/}
                {/*    onPress={onSignUpPressed}*/}
                {/*/>*/}

                {/*<CustomButton*/}
                {/*    text="Forgot Password"*/}
                {/*    onPress={onSignInPressed}*/}
                {/*    type="TERTIARY"*/}
                {/*/>*/}
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

