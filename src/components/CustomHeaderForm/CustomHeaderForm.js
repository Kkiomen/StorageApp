import React from 'react'
import {StyleSheet, View, Text} from "react-native";

const CustomHeaderForm = ({title,props,navigation}) => {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title:{
        textAlign: 'center',
        alignItems: "center",
        fontSize: 18,
        marginVertical: 15,
        opacity: 0.4
    }
});

export default CustomHeaderForm;

