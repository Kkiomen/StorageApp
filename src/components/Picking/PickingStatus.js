import {StyleSheet,Text, TextInput, View} from "react-native";
import React from "react";
import InfoField from "../CustomInput/InfoField";

const PickingStatus = ({collectStatus}) => {

    if(collectStatus){
        return (
            <Text style={[styles.statusCollect, styles.true]}>Completed</Text>
        );
    }else{
        return (
            <Text style={[styles.statusCollect, styles.false]}>Incomplete</Text>
        );
    }

}

const styles = StyleSheet.create({
    statusCollect:{
        borderWidth: 1,
        borderRadius: 2,
        textAlign: "center",
        justifyContent: "center"
    },
    true:{
        color: "#155724",
        backgroundColor: "#d4edda",
        borderColor: "#c3e6cb",
    },
    false:{
        color: "#721c24",
        backgroundColor: "#f8d7da",
        borderColor: "#f5c6cb",
    }
});

export default PickingStatus;
