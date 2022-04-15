import React, {Component} from 'react'
import {Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, Button} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import firebase from "../../../firebase";
import {ListItem} from "react-native-elements";
import CompanyCardInfoWhite from "../../components/Companies/CompanyCardInfoWhite";
import ModalSearch from "../../components/Modal/ModalSearch";
import { Col, Row, Grid } from "react-native-easy-grid";
import {BarCodeScanner} from "expo-barcode-scanner";
import PickingProductInfo from "../../components/Picking/PickingProductInfo";
import PickingStatus from "../../components/Picking/PickingStatus";
import { Audio } from 'expo-av';
class PickingCollectScreen extends Component {

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
            orderProductKeys: [],
            dataForm: null,
            scanned: true,
            hasPermission: null,
            choosedProductToShow: {},
            isChoosedProductToShow: false,
        }
    }

    componentDidMount() {

        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            this.onValUpdate(status === 'granted', 'hasPermission');
        })();


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
                    collectStatus: doc.data().collectStatus,
                    orderProduct: doc.id
                })
            });
        }).then( () =>{
            const elements = []

            arrayProductKey.map((res, i) => {
                db.collection('products').doc(res.productKey).get().then((resc) => {
                    const element = resc.data();
                    element['amount'] = res.amount
                    element['collectStatus'] = res.collectStatus
                    element['key'] = res.productKey
                    element['orderProduct'] = res.orderProduct
                    elements.push(element)

                    if(this.state.isChoosedProductToShow === false && res.collectStatus === false){
                        this.onValUpdate(element,'choosedProductToShow')
                        this.onValUpdate(true,'isChoosedProductToShow')
                    }
                }).then(() =>{
                    //Sort by sectort 1,2 ....
                    elements.sort(function (a,b){
                        return a.sector - b.sector
                    })

                    this.onValUpdate(elements,'choosedProducts')

                })
            })
        });
        this.onValUpdate(arrayProductKey, 'orderProductKeys')

        this.unsubscribeProducts = this.productsFireBase.onSnapshot(this.fetchCollectionProducts)
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.onValUpdate(true, 'scanned');
        this.checkProduct(data)
    };



    checkProduct = (barcode) =>{
        let array = [...this.state.choosedProducts]
        array.map((res, i) => {
            if(res.barcode.toString() === barcode.toString()){
                array[i].collectStatus = true
                firebase.firestore().collection('ordersProducts').doc(res.orderProduct).set({
                    amount: res.amount,
                    collectStatus: true,
                    product: res.key,
                    order: this.state.editOrder.key
                });
            }
        })
        this.onValUpdate(array,'choosedProducts')
        this.getFirstProductWitoutCollectStatus()
    }

    getFirstProductWitoutCollectStatus = () =>{
        let array = this.state.choosedProducts
        array.map((res, i) => {
            if(res.collectStatus === false){
                this.onValUpdate(res,'choosedProductToShow')
            }
        })
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
                        amount: res.amount,
                        collect: res.collectStatus
                    })
                })
            })

        })


        this.props.navigation.navigate('OrdersList')
    }

    render() {
        let orderType
        if(this.state.editOrder.typeOrder == 2){
            orderType = <Text style={styles.typeOrder}>TYPE: Order</Text>;
        }else{
            orderType = <Text style={styles.typeOrder}>TYPE: Acceptance</Text>
        }


        if (this.state.hasPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (this.state.hasPermission === false) {
            return <Text>No access to camera</Text>;
        }

        return (
            <View>

                <ScrollView>
                    <View style={styles.formEle}>

                        <View style={styles.header}>
                            <Text>Order number {this.state.invoiceNumber}/2022</Text>
                            {orderType}
                        </View>

                        <Grid>
                            <Col size={1}>
                                <PickingProductInfo product={this.state.choosedProductToShow} />
                            </Col>
                            <Col size={1}>
                                <BarCodeScanner
                                    onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
                                    style={[styles.barcode]}
                                />
                            </Col>
                        </Grid>

                        {this.state.scanned && <Button title={'Click to start scanning'} onPress={() => this.onValUpdate(false, 'scanned')} />}

                        <View style={styles.containerColumn}>
                            <View style={styles.itemColumn}>
                                <CompanyCardInfoWhite company={this.state.choosedCarrier}/>
                            </View>
                            <View style={styles.itemColumn}>
                                <CompanyCardInfoWhite company={this.state.choosedContractor}/>
                            </View>
                        </View>


                        {

                            this.state.choosedProducts.map((res, i) => {
                                return (
                                    <View style={styles.listView} key={i}>
                                        <Grid>
                                            <Col size={3}>
                                                <Text style={styles.ProductsListTitle}>{res.name}</Text>
                                                <Text style={styles.ProductsListAmount}>Amount: {res.amount}</Text>
                                                <Text style={styles.ProductsListAmount}>Type: {res.type_package}</Text>
                                            </Col>
                                            <Col size={2}>
                                                <PickingStatus collectStatus={res.collectStatus}/>
                                            </Col>
                                        </Grid>
                                    </View>
                                );
                            })
                        }

                    </View>
                </ScrollView>

                {/*<ModalSearch*/}
                {/*    searchFunction={(val) => this.searchCarriers(val, 'searchCarrier')}*/}
                {/*    searchValue = {this.state.searchCarrier}*/}
                {/*    onChoose={(e) => this.chooseCarrier(e)}*/}
                {/*    models={this.state.carriers}*/}
                {/*    visible={this.state.modalVisibleCarrier}*/}
                {/*/>*/}



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
    },
    typeOrder:{
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    barcode:{
        height: 300,
    },

});

export default PickingCollectScreen;

