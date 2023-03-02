import React, {Component} from 'react'
import {Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, Button} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import firebase, {db} from "../../../firebase";
import {BarCodeScanner} from "expo-barcode-scanner";
import PickingProductInfo from "../../components/Picking/PickingProductInfo";
import PickingStatus from "../../components/Picking/PickingStatus";
import {ListItem} from "react-native-elements";
import CompanyCardInfoWhite from "../../components/Companies/CompanyCardInfoWhite";
import ModalSearch from "../../components/Modal/ModalSearch";
import { Col, Row, Grid } from "react-native-easy-grid";
import CustomHeaderForm from "../../components/CustomHeaderForm/CustomHeaderForm";
import {
    collection,
    getDocs,
    where,
    query,
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    addDoc
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import ButtonCarrierRamp from "../../components/CustomButton/ButtonCarrierRamp";

class PickCollScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.array = []
        const firestore = getFirestore()
        const orderIdKey = navigation.getParam('orderKey');
        this.orderDoc = doc(firestore,'orders',orderIdKey);
        this.carriersCollection = collection(db, "carriers");
        this.contractorsCollection = collection(db, "contractors");
        this.productsCollection = collection(db, "products");
        this.orderCollection = collection(db, "orders");
        this.ordersProductsCollection = collection(db, "ordersProducts");

        this.state = {
            keyOrder: orderIdKey,
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


            editOrder: {},
            productsList: [],
            orderProductKeys: [],
            order: null,
            scanned: true,
            hasPermission: null,
            choosedProductToShow: {},
            isChoosedProductToShow: false,
            modalVisibleRamp: false,
            ramp: null,
            tmpRamp: null,

        }
        this.getOrder();
        this.fetchProducts();
        this.fetchCarriers();
        this.fetchContractors();
        this.orderProduct();
    }

    componentDidMount() {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            this.onValUpdate(status === 'granted', 'hasPermission');
        })();


        this.getOrder();
        this.fetchProducts();
        this.fetchCarriers();
        this.fetchContractors();
        this.orderProduct();

    }

    async getOrder(){
        const orderSnap = await getDoc(this.orderDoc);

        if (orderSnap.exists) {
            const element = orderSnap.data();
            this.setState({
                key: orderSnap.key,
                invoiceNumber: element.invoiceNumber.slice(0, -5),
                orderAddress: element.delivery.address,
                orderPostCode: element.delivery.postCode,
                orderCity: element.delivery.city,
                orderCountry: element.delivery.country,
                orderDateAdmission: element.date.admission,
                orderDateDelivery: element.date.delivery,
                order: element
            });
        } else {
            // this.props.navigation.navigate('ProductList')
        }
    }


    async orderProduct(){
        const orderKey = this.state.keyOrder;
        //console.log(orderKey);
        const arrayProduct = []
        const arrayProductKey = []
        const q = query(this.ordersProductsCollection, where('order', '==', orderKey));
        let allOrdersProducts = await getDocs(q);

        allOrdersProducts.forEach((res) => {
            const productKey = res.data().product
            arrayProductKey.push({
                productKey: res.data().product,
                amount: res.data().amount,
                orderProduct: res.id,
                collectStatus: res.data().collectStatus,
            })
        });

        const firestore = getFirestore()
        const elements = []

        arrayProductKey.map(async (res, i) => {
            let productCurrentKey = doc(firestore, 'products', res.productKey);

            const productSnap = await getDoc(productCurrentKey);
            if (productSnap.exists) {
                const element = productSnap.data();
                element['amount'] = res.amount
                element['key'] = res.productKey
                element['collectStatus'] = res.collectStatus
                element['orderProduct'] = res.orderProduct
                if (this.state.isChoosedProductToShow === false && res.collectStatus === false) {
                    this.onValUpdate(element, 'choosedProductToShow')
                    this.onValUpdate(true, 'isChoosedProductToShow')
                }
                elements.push(element)
            }

            this.onValUpdate(elements,'choosedProducts')
        });

        this.onValUpdate(arrayProductKey, 'orderProductKeys')
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
            //console.log(err)
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
                let carrier = {
                    key: res.id,
                    name, address, postCode, city, country, phone, nip, email, owner
                };
                carriers.push(carrier);

                if(carrier.key == this.state.order.carrier){
                    this.onValUpdate(carrier, 'choosedCarrier')
                }
            })
            //console.log(this.state.order.carrier)
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
            //console.log(err)
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
                let contractor = {
                    key: res.id,
                    name, address, postCode, city, country, phone, nip, email, owner
                };
                contractors.push(contractor);

                if(contractor.key == this.state.order.contractor.key){
                    this.onValUpdate(contractor, 'choosedContractor')
                }
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
            //console.log(err)
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


    handleBarCodeScanned = ({ type, data }) => {
        this.onValUpdate(true, 'scanned');
        this.checkProduct(data)
    };

    checkProduct(barcode){
        let array = [...this.state.choosedProducts]

        array.map((res, i) => {
            if(res.barcode.toString() === barcode.toString()){
                res.collectStatus = true
                const firestore = getFirestore()
                const currentProduct = doc(firestore,'ordersProducts', res.orderProduct);

                updateDoc(currentProduct,{
                    collectStatus: true,
                });
                this.onValUpdate(array,'choosedProducts')
                this.getFirstProductWitoutCollectStatus()
            }
        })
    }

    getFirstProductWitoutCollectStatus = () =>{
        let array = this.state.choosedProducts
        array.map((res, i) => {
            if(res.collectStatus === false){
                this.onValUpdate(res,'choosedProductToShow')
            }
        })
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



    saveRamp(){
        this.onValUpdate(!this.state.modalVisibleRamp, 'modalVisibleRamp')
    }

    updateRamp(){
        updateDoc(this.orderDoc,{
            ramp: this.state.tmpRamp
        })
        this.onValUpdate(this.state.tmpRamp, 'ramp')
        this.onValUpdate(!this.state.modalVisibleRamp, 'modalVisibleRamp')
        Toast.show({
            type: 'success',
            text1: 'Number ramp is saved',
        });
    }

    render() {
        let orderType
        if(this.state.editOrder.typeOrder == 2){
            orderType = <Text style={styles.typeOrder}>TYPE: Order</Text>;
        }else{
            orderType = <Text style={styles.typeOrder}>TYPE: Order</Text>
        }

        return (
            <View>

                <ScrollView>
                    <View style={styles.formEle}>

                        <View style={styles.header}>
                            <Text>Invoice no. {this.state.invoiceNumber}/2022</Text>
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


                        {/*<CustomHeaderForm title="Type" />*/}


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
                                                <PickingStatus collectStatus={res.collectStatus} />
                                            </Col>
                                        </Grid>
                                    </View>
                                );
                            })
                        }

                        <View style={styles.carrierInformation}>
                            <ButtonCarrierRamp
                                text="Set ramp"
                                ramp={this.state.ramp}
                                onPress={() => this.saveRamp()}
                            />
                        </View>


                    </View>
                </ScrollView>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisibleRamp}
                    onRequestClose={() => this.onValUpdate(!this.state.modalVisibleRamp, 'modalVisibleRamp')}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalCloseView}>
                                <Pressable
                                    style={styles.modalCloseView}
                                    onPress={() => this.onValUpdate(!this.state.modalVisibleRamp, 'modalVisibleRamp')}
                                >
                                    <Text style={styles.textStyle}>X</Text>
                                </Pressable>
                            </View>
                            <View style={styles.modalCenter}>
                                <Text style={styles.textProductInfo}>Ramp:  {this.state.ramp} </Text>
                                <Text style={styles.label}>Ramp number</Text>
                                <CustomInput
                                    placeholder=""
                                    value={this.state.tmpRamp}
                                    setValue={(val) => this.onValUpdateOnlyNumber(val, 'tmpRamp')}
                                    keyboardType="numeric"
                                    style={styles.searchInput}
                                />
                                <Button
                                    title='Set number ramp'
                                    color="black"
                                    onPress={() => this.updateRamp()}
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
    carrierInformation:{
      marginBottom: 10
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
export default PickCollScreen;

