import React, {useState, useEffect, Component} from 'react'
import {StyleSheet, View, Text, Button, ScrollView, ActivityIndicator} from "react-native";
import firebase, {db} from "../../../firebase";
import CustomInput from "../../components/CustomInput/CustomInput";
import {ListItem} from "react-native-elements";
import { collection, getDocs, onSnapshot, doc } from "firebase/firestore";

import {isLoading} from "expo-font";
import Toast from "react-native-toast-message";
class OrdersListScreen extends Component{

    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    constructor({props, navigation}) {
        super();
        this.docs = getDocs(collection(db, "orders"));
        this.state = {
            orderList: [],
            orderListAll: [],
            isLoading: false,
            searchText: '',
            isDeleted: false
        };
        this.fetchOrder();
    }


    componentDidMount() {
        this.fetchOrder();
    }


    async fetchOrder() {
        const orders = [];
        try {
            const productsRef = collection(db, 'orders');
            let allOrders = await getDocs(productsRef);
            allOrders.forEach((res) => {
                const { invoiceNumber,contractor, carrier,typeOrder,date,delivery} = res.data()
                orders.push({
                    key: res.id,
                    invoiceNumber,
                    contractor,
                    carrier,
                    typeOrder,
                    date,
                    delivery
                });
            })
            this.onValUpdate(orders,'orderList')
            this.onValUpdate(orders,'orderListAll')
            this.onValUpdate(true, 'isLoading')
        } catch (err) {
            console.log(err)
            Toast.show({
                type: 'error',
                text1: 'Wystąpił problem podczas pobierania produktów, spróbuj ponownie później',
            });
        }
    }




    search = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)

        if(state[prop].length === 0){
            this.onValUpdate(this.state.orderListAll, 'orderList')
        }else{
            let newArray = this.state.orderList.filter(function (el)
                {
                    return el.invoiceNumber.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'orderList');
        }
    }


    render() {
        if(!this.state.isLoading){
            return(
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="green"/>
                </View>
            )
        }

        return (
            <View style={styles.wrapper}>
                <View style={styles.buttonAddView}>
                    <Button
                        title='+ Add new order'
                        style={styles.buttonAdd}
                        onPress={() => this.props.navigation.navigate('OrderCreate')}
                    />
                </View>
                <CustomInput
                    placeholder="Invoice number .."
                    value={this.state.searchText}
                    setValue={(val) => this.search(val, 'searchText')}
                    style={styles.searchInput}
                />
                <ScrollView>
                    {
                        this.state.orderList.map((res, i) => {

                            return (
                                <ListItem
                                    id={i}
                                    onPress={() => {
                                        this.props.navigation.navigate('OrdersEdit', {
                                            orderKey: res.key
                                        });
                                    }}
                                    bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>Invoice no.: {res.invoiceNumber}</ListItem.Title>
                                        <ListItem.Subtitle>
                                            {res.typeOrder == 'accept' ? "PRZYJĘCIE" : "ZAMÓWIENIE"} - {res.contractor.name}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron
                                        color="black"
                                    />
                                </ListItem>
                            );
                        })
                    }
                </ScrollView>

            </View>
        );
    }




}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20
    },
    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    searchInput:{
        marginBottom: 20
    },
});

export default OrdersListScreen;

