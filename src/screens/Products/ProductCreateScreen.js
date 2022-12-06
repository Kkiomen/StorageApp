import React, {Component, useState, useContext} from 'react'
import {Button, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Platform, Text} from "react-native";
import firebase, {db} from "../../../firebase";
import storage from "firebase/compat";
import CustomInput from "../../components/CustomInput/CustomInput";
import Toast from 'react-native-toast-message';
import {addDoc, collection} from "firebase/firestore";

class ProductsCreatScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.productCollection = collection(db, "products");
        let tmp = navigation.getParam('data')
        if (typeof tmp !== 'undefined') {
            this.state = {
                name: tmp.name,
                sector: tmp.sector,
                barcode: tmp.barcode,
                type_package: tmp.type_package,
                weight: tmp.weight,
                price_netto: tmp.price_netto,
                price_brutto: tmp.price_brutto,
                isLoading: false
            };
        } else {
            this.state = {
                name: '',
                sector: '',
                barcode: '',
                type_package: '',
                weight: '',
                price_netto: '',
                price_brutto: '',
                isLoading: false
            };
        }
    }

    scanBarCode = () => {
        this.props.navigation.navigate('BarcodeScan', {data: this.state, page: 'ProductsCreate'})
    }


    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    isNum(val) {
        return !isNaN(val)
    }


    addNewProduct() {
        if (
            this.state.name === '' ||
            this.state.sector === '' ||
            this.state.barcode === '' ||
            this.state.type_package === '' ||
            this.state.weight === '' ||
            this.state.price_netto === '' ||
            this.state.price_brutto === ''
        ) {
            Toast.show({
                type: 'error',
                text1: 'Wystąpił błąd',
                text2: 'Wszystkie pola muszą zostać wypełnione',
                position: "bottom"
            });

        } else if (!this.isNum(this.state.price_netto) || !this.isNum(this.state.price_brutto) || !this.isNum(this.state.weight)) {
            Toast.show({
                type: 'error',
                text1: 'Wystąpił błąd',
                text2: 'Cena musi być liczbą',
                position: "bottom"
            });
        } else {
            this.setState({
                isLoading: true,
            });
            addDoc(this.productCollection, {
                name: this.state.name,
                sector: this.state.sector,
                barcode: this.state.barcode,
                type_package: this.state.type_package,
                weight: this.state.weight,
                price_brutto: this.state.price_brutto,
                price_netto: this.state.price_netto,
                quantity: 0
            }).then((res) => {
                Toast.show({
                    type: 'success',
                    text1: 'Produkt został dodany',
                });
                this.props.navigation.navigate('ProductList',{state:{refresh:true}})
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Coś poszło nie tak. Spróbuj ponownie później',
                });
            });
        }
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="green"/>
                </View>
            )
        }

        return (
            <ScrollView style={styles.container}>
                <View style={styles.formEle}>

                    <Text style={styles.label}>Name</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.name}
                        setValue={(val) => this.onValUpdate(val, 'name')}
                    />

                    <Text style={styles.label}>Sector</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.sector}
                        setValue={(val) => this.onValUpdate(val, 'sector')}
                    />


                    <View style={styles.row}>
                        <View style={styles.col6}>
                            <Text style={styles.label}>Barcode</Text>
                            <CustomInput
                                placeholder=""
                                value={this.state.barcode}
                            />
                        </View>
                        <View style={styles.col6}>
                            <Button
                                title='Scan BARCODE'
                                onPress={() => this.scanBarCode()}
                                color="black"
                            />
                        </View>
                    </View>


                    <Text style={styles.label}>Packing type</Text>
                    <CustomInput
                        placeholder="Piece, Packaging, Pallet"
                        value={this.state.type_package}
                        setValue={(val) => this.onValUpdate(val, 'type_package')}
                    />

                    <Text style={styles.label}>Weight (g)</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.weight}
                        keyboardType="numeric"
                        setValue={(val) => this.onValUpdate(val, 'weight')}
                    />

                    <Text style={styles.label}>Price (netto)</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.price_netto}
                        keyboardType="numeric"
                        setValue={(val) => this.onValUpdate(val, 'price_netto')}
                    />

                    <Text style={styles.label}>Price (brutto)</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.price_brutto}
                        keyboardType="numeric"
                        setValue={(val) => this.onValUpdate(val, 'price_brutto')}
                    />

                    <View style={styles.button}>
                        <Button
                            title='Add new product'
                            onPress={() => this.addNewProduct()}
                            color="black"
                            style={styles.buttonCreate}
                        />
                    </View>
                </View>



                <Toast style={styles.toast}/>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formEle: {
        padding: 20
    },
    label: {
        alignItems: 'flex-start',
        textAlign: 'left',
        marginTop: 20
    },
    buttonCreate: {
        paddingVertical: 10,
        paddingBottom: 20,
        position: "relative",
        bottom: 0
    },
});

export default ProductsCreatScreen;

