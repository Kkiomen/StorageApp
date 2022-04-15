import {StyleSheet, Text, View} from "react-native";
import React from "react";

const CardBorder = ({title,text}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        padding: 20,
        marginTop: 20
    },
    title:{
        fontWeight: "bold"
    },
    text:{
        marginTop: 6
    }
});

export default CardBorder;
