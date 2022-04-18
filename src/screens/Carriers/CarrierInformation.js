import React, {Component} from 'react'
import {StyleSheet, ScrollView} from "react-native";
import firebase from "../../../firebase";
import InformationAboutDelivery from "../../components/TransportInformation/InformationAboutDelivery";
import CardBorder from "../../components/TransportInformation/CardBorder";
import settings from "../../static/settings";
import CardBorderProduct from "../../components/TransportInformation/CardBorderProduct";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertDanger from "../../components/Alert/AlertDanger";
import CustomButton from "../../components/CustomButton/CustomButton";
class CarrierInformation extends Component {

    //gg4yVIPUYsnfQWd05IEO

    constructor({props, navigation}) {
        super(props, navigation);
        this.array = []
        this.carriersFireBase = firebase.firestore().collection('carriers')
        this.contractorsFireBase = firebase.firestore().collection('contractors')
        this.productsFireBase = firebase.firestore().collection('products')
        this.state = {
            choosedProducts: [],
            order: null,
            contractor: null,
            carrier: null,
            loadedContractor: false,
            loadedOrder: false,
            AllProducts: [],
            orderProductKeys: [],
            loadedProduct: false,
            fullWeight: 0,
            orderKey: navigation.getParam('orderKey')
        }
    }

    componentDidMount() {
        //Read and put info from order


        this.unsubscribeCarriers = this.carriersFireBase.onSnapshot(this.fetchCollectionCarriers)
        this.unsubscribeContractors = this.contractorsFireBase.onSnapshot(this.fetchCollectionContractors)


        const db = firebase.firestore();
        const orderKey = this.state.orderKey;
        const arrayProduct = []
        const arrayProductKey = []

        db.collection('orders').doc(orderKey).get().then((order) => {
            this.onValUpdate(order.data(), 'order');
            this.onValUpdate(true, 'loadedOrder');
            this.contractorsFireBase.doc(order.data().contractor.key).get().then((contractor) => {
                this.onValUpdate(contractor.data(), 'contractor');
                this.onValUpdate(true, 'loadedContractor');
            });
            this.carriersFireBase.doc(order.data().carrier).get().then((carrier) => {
                this.onValUpdate(carrier.data(), 'carrier');
            });
        });

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
            let weight = 0
            arrayProductKey.map((res, i) => {
                db.collection('products').doc(res.productKey).get().then((resc) => {
                    const element = resc.data();
                    element['amount'] = res.amount
                    element['key'] = res.productKey
                    weight += (parseFloat(res.amount) * parseFloat(element.weight));
                    elements.push(element)
                }).then(() =>{
                    this.onValUpdate(elements, 'AllProducts')
                    this.onValUpdate(weight, 'fullWeight')
                    this.onValUpdate(true, 'loadedProduct')
                })
            })



        });
        this.onValUpdate(arrayProductKey, 'orderProductKeys')

        this.unsubscribeProducts = this.productsFireBase.onSnapshot(this.fetchCollectionProducts)
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

    alertInfoRamp =  ()  =>{
        if(this.state.loadedOrder){
            if(this.state.order.ramp === 0){
                return <AlertDanger text="You can't come to the ramp yet" />
            }else{
                return <AlertSuccess text={"Your turn has come. \nWelcome to rump number: " + this.state.order.ramp} />
            }
        }
         // console.log(this.state.order.ramp)
        //
    }

    render() {
        let contractorInfo = "";
        let placeTakingOverTheGoodsInfo = "";
        let weightInfo = '';
        const senderInfo = settings.nameCompany + "\n" + settings.address  + "\n" + settings.postCode + " " + settings.city + "\n" + settings.country;
        if(this.state.loadedContractor){
            contractorInfo = this.state.contractor.name + "\n" + this.state.contractor.address  + "\n" + this.state.contractor.postCode + " " + this.state.contractor.city + "\n" + this.state.contractor.country;
            placeTakingOverTheGoodsInfo = this.state.order.date.admission + "\n" + this.state.order.delivery.address  + "\n" + this.state.order.delivery.postCode + " " + this.state.order.delivery.city + "\n" + this.state.order.delivery.country;
        }
        if(this.state.loadedProduct){
            weightInfo = (this.state.fullWeight / 1000) + "kg";
        }
        return (
            <ScrollView style={styles.container}>
                {this.alertInfoRamp()}

                <InformationAboutDelivery
                    contractor={this.state.order}
                    status={this.state.loadedOrder}
                />
                <CardBorder
                    title="Sender"
                    text={senderInfo}
                />
                <CardBorder
                    title="Consignee"
                    text={contractorInfo}
                />
                <CardBorder
                    title="Place and date of taking over the goods"
                    text={placeTakingOverTheGoodsInfo}
                />
                <CardBorderProduct
                    products={this.state.AllProducts}
                    status={this.state.loadedProduct}
                    title="Number, method, nature of packing"
                />
                <CardBorder
                    title="Gross weight"
                    text={weightInfo}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 42,
        marginBottom: 50
    },
});

export default CarrierInformation;
