import React, {Component} from 'react'
import firebase from "../../../firebase";
import {StyleSheet, View, ScrollView, Button, Text, Modal, Pressable} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import {BarCodeScanner} from "expo-barcode-scanner";
import {ListItem} from "react-native-elements";
import PickingProductInfo from "../../components/Picking/PickingProductInfo";
import InfoField from "../../components/CustomInput/InfoField";

class SearchProductScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.docs = firebase.firestore().collection('products')
        this.state = {
            searchText: '',
            products: [],
            AllProducts: [],
            hasPermission: null,
            modalVisibleBarcode: false
        }
    }

    componentDidMount() {

        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            this.onValUpdate(status === 'granted', 'hasPermission');
        })();
        this.unsubscribe = this.docs.onSnapshot(this.fetchCollection)
    }

    fetchCollection = (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((res) => {
            const {name, weight, type_package, sector, barcode, price_netto, price_brutto} = res.data()
            products.push({
                key: res.id,
                name,
                weight,
                sector,
                barcode,
                type_package,
                price_netto,
                price_brutto
            });
        });
        this.setState({
            isLoading: false
        });
        this.onValUpdate(products, 'AllProducts')
    }

    scanBarCode = () => {
        this.props.navigation.navigate('BarcodeScan', {data: this.state, page: 'SearchProduct'})
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.onValUpdate(!this.state.modalVisibleBarcode, 'modalVisibleBarcode')
        this.onValUpdate(data.toString(), 'searchText')
        this.search(data.toString(), 'searchText')
    };

    search = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)

        if (state[prop].length > 0) {

            let productWithTheSameBarcode = this.state.AllProducts.filter(function (el) {
                    return el.barcode.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            if (productWithTheSameBarcode.length !== 0){
                this.onValUpdate(productWithTheSameBarcode, 'products');
            }else{
                let newArray = this.state.AllProducts.filter(function (el) {
                        return el.name.toLowerCase().includes(state[prop].toLowerCase())
                    }
                );
                this.onValUpdate(newArray, 'products');
            }

        }
    }

    onValUpdate = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)
    }

    render() {
        if (this.state.hasPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (this.state.hasPermission === false) {
            return <Text>No access to camera</Text>;
        }

        return (
            <ScrollView style={styles.wrapper}>
                <CustomInput
                    placeholder="Search .."
                    value={this.state.searchText}
                    setValue={(val) => this.search(val, 'searchText')}
                    style={styles.searchInput}
                />
                <View style={styles.col6}>
                    <Button
                        title='Scan BARCODE'
                        onPress={() =>  this.onValUpdate(!this.state.modalVisibleBarcode, 'modalVisibleBarcode')}
                        color="black"
                    />
                    {
                        this.state.products.map((res, i) => {
                            return (
                                <View style={styles.containerProductInfo}>
                                    <InfoField label="Product" text={res.name} />
                                    <InfoField label="Sector" text={res.sector} />
                                    <InfoField label="Type" text={res.type_package} />
                                    <InfoField label="Price (netto)" text={res.price_netto} />
                                    <InfoField label="Price (brutto)" text={res.price_brutto} />
                                </View>
                            );
                        })
                    }
                </View>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisibleBarcode}
                    onRequestClose={() => this.onValUpdate(!this.state.modalVisibleBarcode, 'modalVisibleBarcode')}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalCloseView}>
                                <Pressable
                                    style={styles.modalCloseView}
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleBarcode, 'modalVisibleBarcode')}
                                >
                                    <Text style={styles.textStyle}>X</Text>
                                </Pressable>
                            </View>
                            <View style={styles.modalCenter}>
                                <BarCodeScanner
                                    onBarCodeScanned={!this.state.modalVisibleBarcode ? undefined : this.handleBarCodeScanned}
                                    style={[styles.barcode]}
                                />
                            </View>


                        </View>
                    </View>
                </Modal>


            </ScrollView>




        );
    }
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalCenter: {
        //alignItems: "center",
        paddingHorizontal: 35,
        paddingBottom: 35,
    },
    header: {
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        marginBottom: 20,
        backgroundColor: "white"
    },
    formEle: {
        padding: 20
    },
    wrapper: {
        flex: 1,
        padding: 20
    },
    modalCloseView: {
        alignItems: "flex-end",
        padding: 9
    },
    barcode:{
        height: 300,
    },
    containerProductInfo:{
        paddingHorizontal: 10,
        marginTop: 42
    }
});
export default SearchProductScreen;
