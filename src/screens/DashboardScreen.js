import React from "react"
import {View, Text, StyleSheet, Button} from 'react-native'
import CustomButton from "../components/CustomButton/CustomButton";

const DashboardScreen = ({navigation}) => {

    const onSignOutPressed = () =>{
        auth
            .signOut()
            .then(() =>{
                navigation.navigate('SignIn')
            })
    }



    return (
        <View style={styles.root}>
            <Text>Logged</Text>
            <CustomButton
                text="Log out"
                onPress={onSignOutPressed}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20
    },
});


export default DashboardScreen