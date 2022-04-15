import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import React from "react";

const CardBorderProduct = ({title,status,products}) => {
    if(status){
        console.log(products)
        return (
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                {

                    products.map((res, i) => {

                        return (
                            <Text style={styles.text}>{res.name} - {(res.weight * res.amount) / 1000} kg - { res.amount } {res.type_package}</Text>
                        )
                    })

                }

            </View>
        )
    }else{
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="green"/>
            </View>
        )
    }

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
        marginTop: 6,
        paddingTop: 4,
        borderBottomWidth: 1

    }
});

export default CardBorderProduct;
