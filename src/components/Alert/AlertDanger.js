import {StyleSheet,Text, TextInput, View} from "react-native";
import React from "react";

const AlertDanger = ({text}) => {
    return (
        <View style={styles.container}>
            <Text>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        color: '#842029',
        backgroundColor: '#f8d7da',
        borderColor: '#f5c2c7',
        padding: 20,
        borderWidth: 1,
        marginBottom: 20
    },
});

export default AlertDanger;
