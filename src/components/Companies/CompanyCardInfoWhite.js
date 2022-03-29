import React from 'react'
import {StyleSheet, View, Text, Pressable} from "react-native";

const CompanyCardInfoWhite = ({company}) => {
    if(company.name === ''){
        return (
            <View style={[styles.infoCompanies, styles.empty]}>
                <Text>Wybierz firmę</Text>
            </View>
        )
    }else{
        return (
            <View style={styles.infoCompanies}>
                <Text style={styles.nameCompany}>{company.name}</Text>
                <Text>{company.address}</Text>
                <Text>{company.postCode}</Text>
                <Text>{company.city}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    infoCompanies:{
        padding: 15,
        backgroundColor: "white",
    },
    nameCompany:{
        fontWeight: "bold",
        marginBottom: 5
    },
    Text:{
        marginVertical: 5,
        fontSize: 5
    },
    empty:{
        alignItems: "center",
        opacity: 0.3,
        textTransform: "uppercase"
    }
});

export default CompanyCardInfoWhite;

