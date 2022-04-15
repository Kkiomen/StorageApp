import React, {useState, useEffect, Component} from 'react'
import {StyleSheet, View, Text, Button, ScrollView, ActivityIndicator} from "react-native";
import firebase from "../../../firebase";
import CustomInput from "../../components/CustomInput/CustomInput";
import {ListItem} from "react-native-elements";
import {isLoading} from "expo-font";
class OrdersListScreen extends Component{

    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    constructor({props, navigation}) {
        super();
        this.db = firebase.firestore();
        this.state = {
            orderList: [],
            orderListAll: [],
            isLoading: false,
            searchText: '',
            isDeleted: false
        };
    }


    componentDidMount() {
        this.db.collection('orders').get().then(querySnapshot => {
            const order = []
            querySnapshot.forEach((doc) => {
                const { invoiceNumber,contractor, carrier,typeOrder,date,delivery} = doc.data()
                const contractorKey = doc.data().contractor
                let tmpOrderObject = {
                    key: doc.id,
                    invoiceNumber,
                    contractor,
                    carrier,
                    typeOrder,
                    date,
                    delivery
                }
                order.push(tmpOrderObject);
            });

            this.onValUpdate(order,'orderList')
            this.onValUpdate(order,'orderListAll')
            this.onValUpdate(true, 'isLoading')
        });
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
                                    key={i}
                                    onPress={() => {
                                        this.props.navigation.navigate('OrdersEdit', {
                                            orderKey: res.key,
                                            order: res
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

