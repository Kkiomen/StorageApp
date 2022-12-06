import React, {Component, useState, useContext} from 'react'
import {
    Button,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    View,
    TextInput,
    Platform,
    Vibration,
    Text,
    Pressable, Modal
} from "react-native";
import firebase, {db} from "../../../firebase";
import storage from "firebase/compat";
import CustomInput from "../../components/CustomInput/CustomInput";
import Toast from 'react-native-toast-message';
import {
    doc,
    setDoc,
    Timestamp,
    addDoc,
    collection,
    getDocs,
    updateDoc,
    getFirestore,
    query,
    orderBy,
    limit,
    where
} from "firebase/firestore";
import {Col, Grid} from "react-native-easy-grid";
import {BarCodeScanner} from "expo-barcode-scanner";
import {getAuth} from "firebase/auth";
class AcceptanceCreateScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.productsCollection = collection(db, "products");
        let tmp = navigation.getParam('data')
        let typeDoc = navigation.getParam('type')
        this.fetchLastDocument();
        this.state = {
            name: '',
            type: typeDoc,
            documentNumber: '',
            isLoading: false,
            modalVisibleProduct: false,
            products: [],
            AllProducts: [],
            searchProduct: '',
            isChoosedProduct: false,
            currentProduct: {
                name: '',
            },
            choosedProducts: [],
            amountProduct: 0,
            modalVisibleBarcode: false,
        };
        this.fetchProducts();
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

    onValUpdateOnlyNumber = (val, prop) => {
        if (this.isNum(val)) {
            const state = this.state;
            state[prop] = val;
            this.setState(state);
        }
    }

    async fetchProducts() {
        const products = [];
        try {
            let allProducts = await getDocs(this.productsCollection);
            allProducts.forEach((res) => {
                const {name, sector, barcode, type_package, weight, price_netto, price_brutto, quantity} = res.data()
                products.push({
                    key: res.id,
                    name, sector, barcode, type_package, weight, price_netto, price_brutto, quantity
                });
            })
            this.setState({
                products,
            });
            if (typeof products !== 'undefined' && products.length === 0) {
                this.setState({
                    isLoading: false
                });
            }
            this.onValUpdate(products, 'AllProducts')
        } catch (err) {
            console.log(err)
            Toast.show({
                type: 'error',
                text1: 'Wystąpił problem podczas pobierania produktów, spróbuj ponownie później',
            });
        }
    }

    searchProduct = (val, prop) => {
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
                        return el.name.toLowerCase().includes(state[prop].toLowerCase()) || el.barcode.toLowerCase().includes(state[prop].toLowerCase())
                    }
                );
                this.onValUpdate(newArray, 'products');
            }
        }else{
            this.fetchProducts();
        }
    }


    chooseProduct = (obj) => {
        this.onValUpdate(obj, 'currentProduct')
        this.onValUpdate(!this.state.modalVisibleProduct, 'modalVisibleProduct')
        this.onValUpdate(!this.state.isChoosedProduct, 'isChoosedProduct')
    }


    handleBarCodeScanned = ({ type, data }) => {
        this.vibrate()
        this.onValUpdate(!this.state.modalVisibleBarcode, 'modalVisibleBarcode')
        this.onValUpdate(data.toString(), 'searchProduct')
        this.searchProduct(data.toString(), 'searchProduct')
    };


    vibrate() {
        if (Platform.OS === "ios") {
            const interval = setInterval(() => Vibration.vibrate(), 500);
            setTimeout(() => clearInterval(interval), 500);
        } else {
            Vibration.vibrate(500);
        }
    }

    deleteProductFromList = (res, i) =>{
        const tmp = [...this.state.choosedProducts]
        tmp.splice(i, 1)
        this.onValUpdate(tmp,'choosedProducts')
    }

    saveProduct = () => {
        this.onValUpdate(!this.state.isChoosedProduct, 'isChoosedProduct')
        let choosedProduct = this.state.currentProduct;
        choosedProduct['amount'] = this.state.amountProduct
        this.onValUpdate([...this.state.choosedProducts, this.state.currentProduct], 'choosedProducts')
        this.onValUpdate(0, 'amountProduct')
        this.onValUpdate({name: '',}, 'currentProduct')
    }

    async fetchLastDocument(){
        const q = query(collection(db, "documents"), orderBy("created_at", "desc"), limit(1));
        let allDocumentProducts = await getDocs(q);

        allDocumentProducts.forEach((res) => {

            this.onValUpdateOnlyNumber(parseInt(res.data().documentNumber)+1,'documentNumber');
        })
    }

        saveOrder()
        {

            if (this.state.documentNumber === '' || !this.isNum(this.state.documentNumber)) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'The document number must be a number',
                    position: "bottom"
                });
            }

            const productsList = this.state.choosedProducts

            const typeDocument = this.state.type;
            const userUID = getAuth().currentUser.uid
            addDoc(collection(db, "documents"), {
                documentNumber: this.state.documentNumber,
                created_at: Timestamp.fromDate(new Date()),
                user: userUID,
                type: typeDocument
            }).then((docRef) => {
                const key = docRef.id
                productsList.map((res, i) => {
                    let documentProductsCollection = collection(db, "documentProducts");
                    addDoc(documentProductsCollection, {
                        document: key,
                        product: res.key,
                        quantity: res.amount,
                    })
                })
            })

            productsList.map((res, i) => {
                const firestore = getFirestore()
                let docProduct = doc(firestore, 'products', res.key);

                if (typeDocument == 'ISSUES') {
                    updateDoc(docProduct, {
                        quantity: parseInt(res.quantity) - parseInt(res.amount) || 0
                    })
                } else {
                    updateDoc(docProduct, {
                        quantity: parseInt(res.quantity) + parseInt(res.amount) || 0
                    })
                }
            })

            Toast.show({
                type: 'success',
                text1: 'The document is saved',
            });
        }


        render()
        {

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


                        <View style={styles.header}>
                            <Text>
                                {this.state.type == "ISSUES" ? <Text>Issues </Text> : <Text>Acceptance </Text>}
                                no. {this.state.documentNumber}/2023</Text>
                        </View>

                        <Text style={styles.label}>Document number</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.documentNumber}
                            setValue={(val) => this.onValUpdateOnlyNumber(val, 'documentNumber')}
                            keyboardType="numeric"
                        />


                        <View style={styles.productsView}>
                            <Button
                                title='+ Add product'
                                color="green"
                                onPress={() => this.onValUpdate(!this.state.modalVisibleProduct, 'modalVisibleProduct')}
                                style={styles.buttonStyle}
                            />
                        </View>
                        {
                            this.state.choosedProducts.map((res, i) => {
                                return (
                                    <View style={styles.listView} key={i}>
                                        <Grid>
                                            <Col size={3}>
                                                <Text
                                                    style={[styles.ProductsListTitle, styles.strongText]}>{res.name}</Text>
                                                <Text style={styles.ProductsListAmount}>Quantity: {res.amount}</Text>
                                                <Text style={[styles.ProductsListTitle, styles.packageInfo]}>Type
                                                    package: {res.type_package}</Text>
                                            </Col>
                                            <Col size={1}>
                                                <Button
                                                    title='X'
                                                    color="red"
                                                    onPress={() => this.deleteProductFromList(res, i)}
                                                />
                                            </Col>
                                        </Grid>
                                    </View>
                                );
                            })
                        }

                        <Button
                            title='Add new'
                            color='black'
                            onPress={() => this.saveOrder()}
                            style={[styles.buttonStyle, styles.buttonSave]}
                        />

                    </View>


                    <Toast style={styles.toast}/>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisibleProduct}
                        onRequestClose={() => this.onValUpdate(!this.state.modalVisibleProduct, 'modalVisibleProduct')}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.modalCloseView}>
                                    <Pressable
                                        style={styles.modalCloseView}
                                        onPress={() => this.onValUpdate(!this.state.modalVisibleProduct, 'modalVisibleProduct')}
                                    >
                                        <Text style={styles.textStyle}>X</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.modalCenter}>
                                    <CustomInput
                                        placeholder="Search .."
                                        value={this.state.searchProduct}
                                        setValue={(val) => this.searchProduct(val, 'searchProduct')}
                                        style={styles.searchInput}
                                    />
                                    <Button
                                        title='Scan BARCODE'
                                        onPress={() => this.onValUpdate(!this.state.modalVisibleBarcode, 'modalVisibleBarcode')}
                                        color="black"
                                    />
                                    <ScrollView>
                                        {
                                            this.state.products.map((res, i) => {
                                                return (
                                                    <View style={styles.listView}>
                                                        <Pressable
                                                            key={i}
                                                            onPress={() => this.chooseProduct(res)}
                                                        >
                                                            <Text style={styles.strongText}>{res.name}</Text>
                                                            <Text style={styles.typePackage}>Type
                                                                package: {res.type_package}</Text>
                                                        </Pressable>
                                                    </View>
                                                );
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Set Information */}


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isChoosedProduct}
                        onRequestClose={() => this.onValUpdate(!this.state.isChoosedProduct, 'isChoosedProduct')}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <View style={styles.modalCloseView}>
                                    <Pressable
                                        style={styles.modalCloseView}
                                        onPress={() => this.onValUpdate(!this.state.isChoosedProduct, 'isChoosedProduct')}
                                    >
                                        <Text style={styles.textStyle}>X</Text>
                                    </Pressable>
                                </View>
                                <View style={styles.modalCenter}>
                                    <Text
                                        style={styles.textProductInfo}>Produkt: {this.state.currentProduct.name}</Text>
                                    <Text style={styles.typePackage}>Type
                                        package: {this.state.currentProduct.type_package}</Text>
                                    <Text style={styles.label}>Enter quantity</Text>
                                    <CustomInput
                                        placeholder=""
                                        value={this.state.amountProduct}
                                        setValue={(val) => this.onValUpdateOnlyNumber(val, 'amountProduct')}
                                        keyboardType="numeric"
                                        style={styles.searchInput}
                                    />
                                    <Button
                                        title='Add product'
                                        color="black"
                                        onPress={() => this.saveProduct()}
                                        style={styles.buttonDelete}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>


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
    header: {
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        marginBottom: 20,
        backgroundColor: "white"
    },
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
        paddingHorizontal: 35,
        paddingBottom: 35,
    },
    itemColumn: {
        width: '50%',
        paddingHorizontal: 5
    },
    modalCloseView: {
        alignItems: "flex-end",
        padding: 9
    },
    textProductInfo: {
        marginBottom: 10,
        fontWeight: "bold"
    },
    buttonStyle:{
        marginBottom: 15
    },
    listView: {
        borderWidth: 1,
        borderColor: "#605e5e",
        borderRadius: 3,
        padding: 10,
        paddingHorizontal: 20,
        marginVertical: 5
    },
    typePackage:{
        color: "#ADADAD"
    },
    packageInfo:{
        color: "#8F8F8F",
        fontSize: 10
    },
    strongText:{
        fontWeight: "bold"
    },
    barcode:{
        height: 300,
    },
    productsView:{
        marginVertical: 20
    },
    buttonSave:{
        paddingHorizontal: 20
    }
});

export default AcceptanceCreateScreen;

