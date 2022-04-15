import React, {Component} from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Button} from "react-native";
import firebase from "../../../firebase";
import Toast from "react-native-toast-message";
import CustomInput from "../../components/CustomInput/CustomInput";

class ProductEditScreen extends Component{

    constructor({props,navigation}) {
        super();

        this.ref = firebase.firestore().collection('products').doc(navigation.getParam('userkey'));
       // console.log(this.ref);
        let tmp = navigation.getParam('data');

        if(typeof tmp !== 'undefined'){
            this.state = {
                key: tmp.key,
                name: tmp.name,
                sector: tmp.sector,
                barcode: tmp.barcode,
                type_package: tmp.type_package,
                weight: tmp.weight,
                price_netto: tmp.price_netto,
                price_brutto: tmp.price_brutto,
                isLoading: false,
                isDeleted: false
            };
        }else{
            this.state = {
                key: '',
                name: '',
                sector: '',
                barcode: '',
                type_package: '',
                weight: '',
                price_netto: '',
                price_brutto: '',
                isLoading: false,
                isDeleted: false
            };
        }
    }


    componentDidMount() {
        this.ref.get().then((res) => {
            if (res.exists) {
                const element = res.data();
                this.setState({
                    key: res.id,
                    name: element.name,
                    sector:  element.sector,
                    barcode: element.barcode,
                    type_package: element.type_package,
                    weight: element.weight,
                    price_netto: element.price_netto,
                    price_brutto: element.price_brutto,
                    isLoading: false
                });
            } else {
                this.props.navigation.navigate('ProductList')
            }
        });
    }


    scanBarCode = () => {
        this.props.navigation.navigate('BarcodeScan', {data: this.state, page: 'ProductEdit'})
    }


    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    isNum(val){
        return !isNaN(val)
    }

    //https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/
    editProduct() {
        if(
            this.state.name === '' ||
            this.state.sector === '' ||
            this.state.barcode === '' ||
            this.state.type_package === '' ||
            this.state.weight === '' ||
            this.state.price_netto === '' ||
            this.state.price_brutto === ''
        ){
            Toast.show({
                type: 'error',
                text1: 'Wystąpił błąd',
                text2: 'Wszystkie pola muszą zostać wypełnione',
                position: "bottom"
            });

        }else if(!this.isNum(this.state.price_netto) || !this.isNum(this.state.price_brutto) ){
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
            this.ref.set({
                name: this.state.name,
                sector: this.state.sector,
                barcode: this.state.barcode,
                type_package: this.state.type_package,
                weight: this.state.weight,
                price_brutto: this.state.price_brutto,
                price_netto: this.state.price_netto
            }).then((res) => {
                this.props.navigation.navigate('ProductList')
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Coś poszło nie tak. Spróbuj ponownie później',
                });
            });
        }
    }

    deleteProduct(){
        Toast.show({
            type: 'info',
            text1: 'Czy jesteś tego pewny?',
            text2: 'Aby potwierdzić usunięcie tego elementu, kliknij powiadomienie',
            position: "bottom",
            bottomOffset: 150,
            visibilityTime: 1000,
            onPress: () =>{
                this.ref.delete().then((res) => {
                    this.props.navigation.navigate('Dashboard')
                }).catch((err) => {
                    Toast.show({
                        type: 'error',
                        text1: 'Coś poszło nie tak. Spróbuj ponownie później',
                    });
                });
            }
        });
    }

    render() {

        if(this.state.isLoading){
            return(
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
                        setValue={(val) => this.onValUpdate(val, 'weight')}
                    />

                    <Text style={styles.label}>Price (netto)</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.price_netto}
                        setValue={(val) => this.onValUpdate(val, 'price_netto')}
                    />

                    <Text style={styles.label}>Price (brutto)</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.price_brutto}
                        setValue={(val) => this.onValUpdate(val, 'price_brutto')}
                    />

                </View>

                <View style={styles.button}>
                    <Button
                        title='Edit product'
                        onPress={() => this.editProduct()}
                        color="black"
                        style={styles.buttonCreate}
                    />
                </View>
                <View style={styles.buttonDeleteRow}>
                    <Button
                        title='Usuń produkt'
                        onPress={() => this.deleteProduct()}
                        color="red"
                        style={styles.buttonDelete}
                    />
                </View>

                <Toast style={styles.toast}/>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formEle:{
        padding: 20
    },
    label:{
        alignItems: 'flex-start',
        textAlign: 'left',
        marginTop: 20
    },
    buttonDelete:{
        marginTop: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        position: "relative",
        bottom: 0
    },
    buttonDeleteRow:{
      marginVertical: 20,
      marginTop: 20,
    },
});


export default ProductEditScreen;

