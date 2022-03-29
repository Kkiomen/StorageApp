import React, {useState, useEffect } from 'react'
import {StyleSheet, View, Text, Button} from "react-native";
import firebase from "../../../firebase";

const OrdersListScreen = ({props,navigation}) => {

    const [productsList, setProductsList] = useState([])

    const db = firebase.firestore();

     const orderKey = 'R758hGkSFMBmY0CFsi4v';
        useEffect(() => {
            db.collection('ordersProducts')
                .where('order', '==', orderKey).get().then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    const productKey = doc.data().product
                    let tmp = productsList
                    db.collection('products').doc(productKey).get().then((res) => {
                        tmp.push(res.data())
                    });
                    setProductsList(tmp)
                });
            });
        });

     let productsArray = []



    //console.log(productsList);
    return (
        <View>
            <Text></Text>
            <Button
                title="TEST"
                onPress={() => (console.log(productsList))}
            />

        </View>
    );
}

const styles = StyleSheet.create({});

export default OrdersListScreen;

