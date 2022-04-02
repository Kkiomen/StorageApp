import {StyleSheet,Text, TextInput, View} from "react-native";
import React from "react";

const InfoField = ({label, text}) => {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.info}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: "white",
        padding: 10,
        marginVertical: 3
    },
    label:{
        textTransform: "uppercase",
        fontSize: 6
    },
    info:{
        fontWeight: "bold"
    }
});

export default InfoField;
