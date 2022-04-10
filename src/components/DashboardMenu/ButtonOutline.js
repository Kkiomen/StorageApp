import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import InfoField from "../CustomInput/InfoField";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCar} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Grid } from "react-native-easy-grid";

const ButtonOutline = ({onPress,text}) => {

        return (
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>{text}</Text>
            </Pressable>
        );




}

const styles = StyleSheet.create({
    button:{
        borderWidth: 1,
        padding: 20,
        marginEnd: 20,
    },
    buttonText:{
        textTransform: "uppercase"
    }
});

export default ButtonOutline;
