import React, {Component} from 'react'
import {Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, Button} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import firebase, {db} from "../../../firebase";
import {ListItem} from "react-native-elements";
import CompanyCardInfoWhite from "../../components/Companies/CompanyCardInfoWhite";
import ModalSearch from "../../components/Modal/ModalSearch";
import { Col, Row, Grid } from "react-native-easy-grid";
import Select from 'react-native-select-plus';
import {addDoc, collection, getDocs} from "firebase/firestore";
import {Picker} from '@react-native-picker/picker';
import CustomHeaderForm from "../../components/CustomHeaderForm/CustomHeaderForm";
import Toast from "react-native-toast-message";
class OrdersCreateScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.carriersCollection = collection(db, "carriers");
        this.contractorsCollection = collection(db, "contractors");
        this.productsCollection = collection(db, "products");
        this.orderCollection = collection(db, "orders");
        this.state = {
            typeOrder: 'normal',
            modalVisibleCarrier: false,
            modalVisibleContractor: false,
            modalVisibleProduct: false,
            invoiceNumber: '',
            orderAddress: '',
            orderPostCode: '',
            orderCity: '',
            orderCountry: '',
            orderDateAdmission : '',
            orderDateDelivery : '',

            carriers: [],
            choosedCarrier: {
                name: '',
            },
            AllCarriers: [],
            searchCarrier: '',

            contractors: [],
            choosedContractor: {
                name: '',
            },
            AllContractors: [],
            searchContractor: '',

            products: [],
            AllProducts: [],
            searchProduct: '',
            isChoosedProduct: false,
            currentProduct: {
                name: '',
            },
            choosedProducts: [],
            amountProduct: 0,
            lastOrder: null,

        }
        this.fetchProducts();
        this.fetchCarriers();
        this.fetchContractors();
    }

    componentDidMount() {
        this.fetchProducts();
        this.fetchCarriers();
        this.fetchContractors();
    }

    async fetchProducts() {
        const products = [];
        try {
            let allProducts = await getDocs(this.productsCollection);
            allProducts.forEach((res) => {
                const {name, sector, barcode, type_package, weight, price_netto, price_brutto} = res.data()
                products.push({
                    key: res.id,
                    name, sector, barcode, type_package, weight, price_netto, price_brutto
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

    async fetchCarriers() {
        const carriers = [];
        try {
            let allCarriers = await getDocs(this.carriersCollection);
            allCarriers.forEach((res) => {
                const {name, address, postCode, city, country, phone, nip, email, owner} = res.data()
                carriers.push({
                    key: res.id,
                    name, address, postCode, city, country, phone, nip, email, owner
                });
            })
            this.setState({
                carriers,
            });
            if (typeof carriers !== 'undefined' && carriers.length === 0) {
                this.setState({
                    isLoading: false
                });
            }
            this.onValUpdate(carriers, 'AllCarriers')
        } catch (err) {
            console.log(err)
            Toast.show({
                type: 'error',
                text1: 'Wystąpił problem podczas pobierania dostawców, spróbuj ponownie później',
            });
        }
    }

    async fetchContractors() {
        const contractors = [];
        try {
            let allContractors = await getDocs(this.contractorsCollection);
            allContractors.forEach((res) => {
                const {name, address, postCode, city, country, phone, nip, email, owner} = res.data()
                contractors.push({
                    key: res.id,
                    name, address, postCode, city, country, phone, nip, email, owner
                });
            })
            this.setState({
                contractors,
            });
            if (typeof contractors !== 'undefined' && contractors.length === 0) {
                this.setState({
                    isLoading: false
                });
            }
            this.onValUpdate(contractors, 'AllContractors')
        } catch (err) {
            console.log(err)
            Toast.show({
                type: 'error',
                text1: 'Wystąpił problem podczas pobierania kontrahentów, spróbuj ponownie później',
            });
        }
    }


    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    onValUpdateOnlyNumber = (val, prop) => {
        if (this.isNum(val)) {
            const state = this.state;
            state[prop] = val;
            this.setState(state);
        }
    }

    isNum(val) {
        return !isNaN(val)
    }


    searchCarriers = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)

        if (state[prop].length === 0) {
            this.onValUpdate(this.state.AllCarriers, 'carriers')
        } else {
            let newArray = this.state.carriers.filter(function (el) {
                    return el.name.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'carriers');
        }
    }

    searchContractor = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)

        if (state[prop].length === 0) {
            this.onValUpdate(this.state.AllContractors, 'contractors')
        } else {
            let newArray = this.state.contractors.filter(function (el) {
                    return el.name.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'contractors');
        }
    }

    searchProduct = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)
        this.fetchProducts();

        if (state[prop].length === 0) {
            this.onValUpdate(this.state.AllProducts, 'products')
        } else {
            let newArray = this.state.products.filter(function (el) {
                    return el.name.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'products');
        }
    }


    chooseCarrier = (obj) => {
        this.onValUpdate(obj, 'choosedCarrier')
        this.onValUpdate(!this.state.modalVisibleCarrier, 'modalVisibleCarrier')
    }

    chooseContractor = (obj) => {
        this.onValUpdate(obj, 'choosedContractor')
        this.onValUpdate(!this.state.modalVisibleContractor, 'modalVisibleContractor')
    }

    chooseProduct = (obj) => {
        this.onValUpdate(obj, 'currentProduct')
        this.onValUpdate(!this.state.modalVisibleProduct, 'modalVisibleProduct')
        this.onValUpdate(!this.state.isChoosedProduct, 'isChoosedProduct')
    }

    saveProduct = () => {
        this.onValUpdate(!this.state.isChoosedProduct, 'isChoosedProduct')
        let choosedProduct = this.state.currentProduct;
        choosedProduct['amount'] = this.state.amountProduct
        this.onValUpdate([...this.state.choosedProducts, this.state.currentProduct], 'choosedProducts')
        this.onValUpdate(0, 'amountProduct')
        this.onValUpdate({name: '',}, 'currentProduct')
    }

    deleteProductFromList = (res, i) =>{
        const tmp = [...this.state.choosedProducts]
        tmp.splice(i, 1)
        this.onValUpdate(tmp,'choosedProducts')
    }

    saveOrder = () => {
        const productsList = this.state.choosedProducts
        addDoc(this.orderCollection,{
            invoiceNumber: this.state.invoiceNumber + "/2023",
            carrier: this.state.choosedCarrier.key,
            contractor: {
                name: this.state.choosedContractor.name,
                key: this.state.choosedContractor.key
            },
            delivery: {
                address: this.state.orderAddress,
                postCode: this.state.orderPostCode,
                city: this.state.orderCity,
                country: this.state.orderCountry,
            },
            date:{
                admission: this.state.orderDateAdmission,
                delivery: this.state.orderDateDelivery
            },
            typeOrder: this.state.typeOrder, complete: false
        }).then(function (docRef) {
            const key = docRef.id
            productsList.map((res, i) => {
                let ordersProductsCollection = collection(db, "ordersProducts");
                addDoc(ordersProductsCollection,{
                    order: key,
                    product: res.key,
                    amount: res.amount,
                    collectStatus: false
                })
            })
        })
        this.props.navigation.navigate('OrdersList')
    }

    render() {
        return (
            <View>

                <ScrollView>
                    <View style={styles.formEle}>

                        <View style={styles.header}>
                            <Text>Invoice no. {this.state.invoiceNumber}/2023</Text>
                        </View>

                        <Text style={styles.label}>Invoice number</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.invoiceNumber}
                            setValue={(val) => this.onValUpdateOnlyNumber(val, 'invoiceNumber')}
                            keyboardType="numeric"
                        />

                        <CustomHeaderForm title="Date" />

                        <Text style={styles.label}>Date of receipt of the product</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.orderDateAdmission}
                            setValue={(val) => this.onValUpdate(val, 'orderDateAdmission')}
                        />

                        <Text style={styles.label}>Product delivery date</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.orderDateDelivery}
                            setValue={(val) => this.onValUpdate(val, 'orderDateDelivery')}
                        />



                        <CustomHeaderForm title="Delivery" />

                        <Text style={styles.label}>Address</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.orderAddress}
                            setValue={(val) => this.onValUpdate(val, 'orderAddress')}
                        />

                        <Text style={styles.label}>PostCode</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.orderPostCode}
                            setValue={(val) => this.onValUpdate(val, 'orderPostCode')}
                        />

                        <Text style={styles.label}>City</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.orderCity}
                            setValue={(val) => this.onValUpdate(val, 'orderCity')}
                        />

                        <Text style={styles.label}>Country</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.orderCountry}
                            setValue={(val) => this.onValUpdate(val, 'orderCountry')}
                        />

                        <View style={styles.containerColumn}>
                            <View style={styles.itemColumn}>
                                <Button
                                    title='Add Carrier'
                                    color="black"
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleCarrier, 'modalVisibleCarrier')}
                                    style={styles.buttonDelete}
                                />
                                <CompanyCardInfoWhite company={this.state.choosedCarrier}/>
                            </View>
                            <View style={styles.itemColumn}>
                                <Button
                                    title='Add contractor'
                                    color="black"
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleContractor, 'modalVisibleContractor')}
                                    style={styles.buttonDelete}
                                />
                                <CompanyCardInfoWhite company={this.state.choosedContractor}/>
                            </View>
                        </View>


                        <View style={styles.productsView}>
                            <Button
                                title='+ Add product'
                                color="green"
                                onPress={() => this.onValUpdate(!this.state.modalVisibleProduct, 'modalVisibleProduct')}
                                style={styles.buttonDelete}
                            />
                        </View>
                        {
                            this.state.choosedProducts.map((res, i) => {
                                return (
                                    <View style={styles.listView} key={i}>
                                        <Grid>
                                            <Col size={3}>
                                                <Text style={styles.ProductsListTitle}>{res.name}</Text>
                                                <Text style={styles.ProductsListAmount}>Amount: {res.amount}</Text>
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
                            title='Add new order'
                            color='black'
                            onPress={() => this.saveOrder()}
                            style={styles.buttonDelete}
                        />

                    </View>
                </ScrollView>

                {/*<ModalSearch*/}
                {/*    searchFunction={(val) => this.searchCarriers(val, 'searchCarrier')}*/}
                {/*    searchValue = {this.state.searchCarrier}*/}
                {/*    onChoose={(e) => this.chooseCarrier(e)}*/}
                {/*    models={this.state.carriers}*/}
                {/*    visible={this.state.modalVisibleCarrier}*/}
                {/*/>*/}


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisibleCarrier}
                    onRequestClose={() => this.onValUpdate(!this.state.modalVisibleCarrier, 'modalVisibleCarrier')}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalCloseView}>
                                <Pressable
                                    style={styles.modalCloseView}
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleCarrier, 'modalVisibleCarrier')}
                                >
                                    <Text style={styles.textStyle}>X</Text>
                                </Pressable>
                            </View>
                            <View
                                style={styles.modalCenter}>
                                <CustomInput
                                    placeholder="Search .."
                                    value={this.state.searchCarrier}
                                    setValue={(val) => this.searchCarriers(val, 'searchCarrier')}
                                    style={styles.searchInput}
                                />
                                <ScrollView>
                                    {
                                        this.state.carriers.map((res, i) => {
                                            return (
                                                <View style={styles.listView}>
                                                    <Pressable
                                                        key={i}
                                                        onPress={() => this.chooseCarrier(res)}
                                                    >
                                                        <Text>{res.name}</Text>
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


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisibleContractor}
                    onRequestClose={() => this.onValUpdate(!this.state.modalVisibleContractor, 'modalVisibleContractor')}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalCloseView}>
                                <Pressable
                                    style={styles.modalCloseView}
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleContractor, 'modalVisibleContractor')}
                                >
                                    <Text style={styles.textStyle}>X</Text>
                                </Pressable>
                            </View>
                            <View
                                style={styles.modalCenter}>
                                <CustomInput
                                    placeholder="Search .."
                                    value={this.state.searchContractor}
                                    setValue={(val) => this.searchCarriers(val, 'searchContractor')}
                                    style={styles.searchInput}
                                />
                                <ScrollView>
                                    {
                                        this.state.contractors.map((res, i) => {
                                            return (
                                                <View style={styles.listView}>
                                                    <Pressable
                                                        key={i}
                                                        onPress={() => this.chooseContractor(res)}
                                                    >
                                                        <Text>{res.name}</Text>
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


                {/*Product*/}


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
                                <ScrollView>
                                    {
                                        this.state.products.map((res, i) => {
                                            return (
                                                <View style={styles.listView}>
                                                    <Pressable
                                                        key={i}
                                                        onPress={() => this.chooseProduct(res)}
                                                    >
                                                        <Text>{res.name}</Text>
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
                                <Text style={styles.textProductInfo}>Produkt: {this.state.currentProduct.name}</Text>
                                <Text style={styles.label}>Podaj ilość</Text>
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


            </View>
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
    marginBottom: {
        marginBottom: 30
    },
    containerColumn: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    itemColumn: {
        width: '50%',
        paddingHorizontal: 5
    },
    modalCloseView: {
        alignItems: "flex-end",
        padding: 9
    },
    listView: {
        borderWidth: 1,
        borderColor: "#605e5e",
        borderRadius: 3,
        padding: 10,
        paddingHorizontal: 20,
        marginVertical: 5
    },
    productsView: {
        marginVertical: 25
    },
    textProductInfo: {
        marginBottom: 10,
        fontWeight: "bold"
    },
    ProductsListTitle:{
        fontWeight: "bold"
    },
    ProductsListAmount:{
        opacity: 0.4
    },
    editButton:{
        marginTop: 20
    },
    select:{
        backgroundColor: "white",
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        paddingVertical: 10
    }

});

export default OrdersCreateScreen;

