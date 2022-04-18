import {StyleSheet,Text, TextInput, View} from "react-native";
import React from "react";

const AlertSuccess = ({text}) => {
    return (
        <View style={styles.container}>
            <Text>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        color: '#0f5132',
        backgroundColor: '#d1e7dd',
        borderColor: '#badbcc',
        padding: 20,
        borderWidth: 1,
        marginBottom: 20
    },
});

export default AlertSuccess;
