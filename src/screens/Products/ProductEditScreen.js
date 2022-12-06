import React, {Component} from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Button} from "react-native";
import firebase from "../../../firebase";
import Toast, {SuccessToast} from "react-native-toast-message";
import CustomInput from "../../components/CustomInput/CustomInput";
import { getFirestore, deleteDoc, getDoc,doc, updateDoc } from 'firebase/firestore'

class ProductEditScreen extends Component{

    constructor({props,navigation}) {
        super();

        const firestore = getFirestore()
        this.ref = doc(firestore,'products',navigation.getParam('userkey'));
        let dataProductFromNavigation = navigation.getParam('data');

        if(typeof dataProductFromNavigation !== 'undefined'){
            this.state = {
                key: dataProductFromNavigation.key,
                name: dataProductFromNavigation.name,
                sector: dataProductFromNavigation.sector,
                barcode: dataProductFromNavigation.barcode,
                type_package: dataProductFromNavigation.type_package,
                weight: dataProductFromNavigation.weight,
                price_netto: dataProductFromNavigation.price_netto,
                price_brutto: dataProductFromNavigation.price_brutto,
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
        this.getProduct();
    }


     componentDidMount() {
        this.getProduct();
    }

    async getProduct(){
        const productSnap = await getDoc(this.ref);

        if (productSnap.exists) {
            const element = productSnap.data();
            this.setState({
                key: productSnap.id,
                name: element.name,
                sector: element.sector,
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

            updateDoc(this.ref, {
                name: this.state.name,
                sector: this.state.sector,
                barcode: this.state.barcode,
                type_package: this.state.type_package,
                weight: this.state.weight,
                price_brutto: this.state.price_brutto,
                price_netto: this.state.price_netto
            }).then((res) => {
                this.setState({
                    isLoading: false,
                });
                Toast.show({
                    type: 'success',
                    text1: 'Dane zostały zaktualizowane',
                });
            }).catch(error => {
                Toast.show({
                    type: 'error',
                    text1: 'Coś poszło nie tak. Spróbuj ponownie później',
                });
                console.log(error)
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
                deleteDoc(this.ref).then((res) => {
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

                <View style={[styles.button, styles.buttonOption]}>
                    <Button
                        title='Edit product'
                        onPress={() => this.editProduct()}
                        color="black"
                        style={styles.buttonCreate}
                    />
                </View>
                <View style={[styles.buttonDeleteRow, styles.buttonOption]}>
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
    buttonOption:{
        paddingHorizontal: 10
    }
});


export default ProductEditScreen;

