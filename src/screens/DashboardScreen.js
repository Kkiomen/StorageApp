import React from "react"
import {View, Text, StyleSheet, Button, ScrollView, Pressable} from 'react-native'
import CustomButton from "../components/CustomButton/CustomButton";
import {auth} from "../../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {faBox, faCar, faSquare} from "@fortawesome/free-solid-svg-icons";
import darkTheme from "@react-navigation/native/src/theming/DarkTheme";


const DashboardScreen = ({navigation}) => {

    const onSignOutPressed = () =>{
        auth
            .signOut()
            .then(() =>{
                navigation.navigate('SignIn')
            })
    }
    const onPressMenuOptions = () => {
        navigation.navigate('ProductList')
    }


     const onPressMenuOptionsContractor = (type) => {
        navigation.navigate('CompaniesList', {type: type})
    }

    const onPressMenuOptionsOrder = () => {
        navigation.navigate('OrderCreate')
    }

    return (
        <View style={styles.root}>
            <View style={styles.logo}>
                <FontAwesomeIcon styles={styles.logoIcon} icon={faBox} size={45} />
                <Text style={styles.logoText}>Storage</Text>
            </View>


            <ScrollView horizontal={true}>
                <Pressable style={styles.button} onPress={onPressMenuOptions}>
                    <Text style={styles.buttonText}>Zamówienia do skompletowania</Text>
                </Pressable>
            </ScrollView>

            <FontAwesomeIcon  icon={faCar} size={45} />
            <Text>fdssfdsdfsdf</Text>

            <ScrollView>

            <Button
                title='Produkty'
                onPress={() => onPressMenuOptions()}
                color="black"
                style={styles.buttonMargin}
            />


            <Button
                title='Przewoźnicy'
                onPress={() => onPressMenuOptionsContractor('CARRIERS')}
                color="black"
                style={styles.buttonMargin}
            />

            <Button
                title='Kontrachenci'
                onPress={() => onPressMenuOptionsContractor('CONTRACTORS')}
                color="black"
                style={styles.buttonMargin}
            />

                <Button
                    title='Zamówienia'
                    onPress={() => onPressMenuOptionsOrder()}
                    color="black"
                    style={styles.buttonMargin}
                />

            </ScrollView>


            {/*<Text>Logged</Text>*/}
            {/*<CustomButton*/}
            {/*    text="Log out"*/}
            {/*    onPress={onSignOutPressed}*/}
            {/*/>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        marginTop: 30,
    },
    logo:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 20,
    },
    logoText:{
        fontWeight: '900',
        textTransform: 'uppercase',
        fontSize: 30,
        marginHorizontal: 10
    },
    logoIcon:{
        marginEnd: 20,
        marginTop: 40
    },
    button:{
        borderWidth: 1,
        padding: 20,
        marginEnd: 20,
    },
    buttonMargin:{
        marginVertical: 20,
        marginBottom: 30,
    }
});


export default DashboardScreen
