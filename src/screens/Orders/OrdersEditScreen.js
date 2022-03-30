import React, {Component} from 'react'
import {Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, Button} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import firebase from "../../../firebase";
import {ListItem} from "react-native-elements";
import CompanyCardInfoWhite from "../../components/Companies/CompanyCardInfoWhite";
import ModalSearch from "../../components/Modal/ModalSearch";
import { Col, Row, Grid } from "react-native-easy-grid";

class OrdersEditScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.array = []
        this.carriersFireBase = firebase.firestore().collection('carriers')
        this.contractorsFireBase = firebase.firestore().collection('contractors')
        this.productsFireBase = firebase.firestore().collection('products')
        this.state = {
            modalVisibleCarrier: false,
            modalVisibleContractor: false,
            modalVisibleProduct: false,
            invoiceNumber: '',

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


            editOrder: {},
            productsList: [],
            orderProductKeys: []
        }
    }

    componentDidMount() {
        //Read and put info from order
        this.onValUpdate(this.props.navigation.getParam('order'), 'editOrder')
        this.onValUpdate(this.state.editOrder.invoiceNumber.slice(0, -5),'invoiceNumber')

        this.unsubscribeCarriers = this.carriersFireBase.onSnapshot(this.fetchCollectionCarriers)
        this.unsubscribeContractors = this.contractorsFireBase.onSnapshot(this.fetchCollectionContractors)


        const db = firebase.firestore();
        const orderKey = this.state.editOrder.key;
        const arrayProduct = []
        const arrayProductKey = []
        db.collection('ordersProducts')
            .where('order', '==', orderKey).get().then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                const productKey = doc.data().product
                arrayProductKey.push({
                    productKey: doc.data().product,
                    amount: doc.data().amount,
                })
            });
        }).then( () =>{
            //console.log(arrayProductKey)
            const elements = []
            arrayProductKey.map((res, i) => {
                db.collection('products').doc(res.productKey).get().then((resc) => {
                    const element = resc.data();
                    element['amount'] = res.amount
                    element['key'] = res.productKey
                    elements.push(element)
                }).then(() =>{
                    this.onValUpdate(elements,'choosedProducts')
                    //console.log(this.state.choosedProducts)
                })
            })
        });
        this.onValUpdate(arrayProductKey, 'orderProductKeys')

        this.unsubscribeProducts = this.productsFireBase.onSnapshot(this.fetchCollectionProducts)
    }


    fetchCollectionCarriers = (querySnapshot) => {
        const carriers = [];
        querySnapshot.forEach((res) => {
            const {name, address, postCode, city, country, phone, nip, email, owner} = res.data()
            carriers.push({
                key: res.id,
                name, address, postCode, city, country, phone, nip, email, owner
            });
        });
        this.setState({
            carriers,
        });


        if (typeof carriers !== 'undefined' && carriers.length === 0) {
            this.setState({
                isLoading: false
            });
        }
        this.onValUpdate(carriers, 'AllCarriers')
        const carrierKey = this.state.editOrder.carrier
        let getCarrier = carriers.filter(function (el) {
            return el.key.includes(carrierKey)
        })
        this.onValUpdate(getCarrier[0], 'choosedCarrier')
    }

    fetchCollectionContractors = (querySnapshot) => {
        const contractors = [];
        querySnapshot.forEach((res) => {
            const {name, address, postCode, city, country, phone, nip, email, owner} = res.data()
            contractors.push({
                key: res.id,
                name, address, postCode, city, country, phone, nip, email, owner
            });
        });
        this.setState({
            contractors,
        });
        if (typeof contractors !== 'undefined' && contractors.length === 0) {
            this.setState({
                isLoading: false
            });
        }
        this.onValUpdate(contractors, 'AllContractors')
        const contractorKey = this.state.editOrder.contractor.key
        let getContractor = contractors.filter(function (el) {
            return el.key.includes(contractorKey)
        })
        this.onValUpdate(getContractor[0], 'choosedContractor')
    }


    fetchCollectionProducts = (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((res) => {
            const {name, sector, barcode, type_package, weight, price_netto, price_brutto} = res.data()
            products.push({
                key: res.id,
                name, sector, barcode, type_package, weight, price_netto, price_brutto
            });
        });
        this.setState({
            products,
        });
        if (typeof products !== 'undefined' && products.length === 0) {
            this.setState({
                isLoading: false
            });
        }
        this.onValUpdate(products, 'AllProducts')
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


    saveOrder() {

        const key = this.state.editOrder.key
        const db = firebase.firestore().collection('orders').doc(key)

        const productsList = this.state.choosedProducts
        db.set({
            invoiceNumber: this.state.invoiceNumber + "/2022",
            carrier: this.state.choosedCarrier.key,
            contractor: {
                name: this.state.choosedContractor.name,
                key: this.state.choosedContractor.key
            },
        }).then(function (docRef) {

            firebase.firestore().collection('ordersProducts').where('order', '==', key).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().order === key){
                        doc.ref.delete();
                    }
                });
            }).then(() => {
                productsList.map((res, i) => {
                    const cureentDb = firebase.firestore().collection('ordersProducts')
                    cureentDb.add({
                        order: key,
                        product: res.key,
                        amount: res.amount
                    })
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
                            <Text>Faktura nr {this.state.invoiceNumber}/2022</Text>
                        </View>

                        <Text style={styles.label}>Numer Faktury</Text>
                        <CustomInput
                            placeholder=""
                            value={this.state.invoiceNumber}
                            setValue={(val) => this.onValUpdateOnlyNumber(val, 'invoiceNumber')}
                            keyboardType="numeric"
                        />


                        <View style={styles.containerColumn}>
                            <View style={styles.itemColumn}>
                                <Button
                                    title='Dodaj przewoźnika'
                                    color="black"
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleCarrier, 'modalVisibleCarrier')}
                                    style={styles.buttonDelete}
                                />
                                <CompanyCardInfoWhite company={this.state.choosedCarrier}/>
                            </View>
                            <View style={styles.itemColumn}>
                                <Button
                                    title='Dodaj kontrahenta'
                                    color="black"
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleContractor, 'modalVisibleContractor')}
                                    style={styles.buttonDelete}
                                />
                                <CompanyCardInfoWhite company={this.state.choosedContractor}/>
                            </View>
                        </View>


                        <View style={styles.productsView}>
                            <Button
                                title='+ Dodaj produkt'
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
                                                <Text style={styles.ProductsListAmount}>Ilość: {res.amount}</Text>
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
                            title='Edytuj zamówienie'
                            color='black'
                            onPress={() => this.saveOrder()}
                            style={styles.editButton}
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
                                    placeholder="Szukaj .."
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
                                    placeholder="Szukaj .."
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
                                    placeholder="Szukaj .."
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
                                    title='Dodaj produkt'
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
    containerColumnProducts: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    itemColumnProduct: {
        width: '70%',
        paddingHorizontal: 5
    },itemColumnClose: {
        width: '30%',
        paddingHorizontal: 5
    },
    ProductsListTitle:{
        fontWeight: "bold"
    },
    ProductsListAmount:{
        opacity: 0.4
    },
    editButton:{
      marginTop: 20
    }

});

export default OrdersEditScreen;

