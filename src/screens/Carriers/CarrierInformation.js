import React, {Component} from 'react'
import {StyleSheet, ScrollView} from "react-native";
import firebase, {db} from "../../../firebase";
import InformationAboutDelivery from "../../components/TransportInformation/InformationAboutDelivery";
import CardBorder from "../../components/TransportInformation/CardBorder";
import settings from "../../static/settings";
import CardBorderProduct from "../../components/TransportInformation/CardBorderProduct";
import AlertSuccess from "../../components/Alert/AlertSuccess";
import AlertDanger from "../../components/Alert/AlertDanger";
import CustomButton from "../../components/CustomButton/CustomButton";
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";
import Toast from "react-native-toast-message";
class CarrierInformation extends Component {

    //gg4yVIPUYsnfQWd05IEO

    constructor({props, navigation}) {
        super(props, navigation);
        this.array = []
        const firestore = getFirestore()
        this.carriersCollection = collection(db, "carriers");
        this.contractorsCollection = collection(db, "contractors");
        this.productsCollection = collection(db, "products");
        this.ordersProductsCollection = collection(db, "ordersProducts");
        this.orderDoc = doc(firestore,'orders',navigation.getParam('orderKey'));
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

        this.getOrder();
        this.fetchProducts();
        this.orderProduct();
    }

    componentDidMount() {
        //Read and put info from order


        // this.unsubscribeCarriers = this.carriersFireBase.onSnapshot(this.fetchCollectionCarriers)
        // this.unsubscribeContractors = this.contractorsFireBase.onSnapshot(this.fetchCollectionContractors)
        //
        //
        // const db = firebase.firestore();
        // const orderKey = this.state.orderKey;
        // const arrayProduct = []
        // const arrayProductKey = []
        //
        // db.collection('orders').doc(orderKey).get().then((order) => {
        //     this.onValUpdate(order.data(), 'order');
        //     this.onValUpdate(true, 'loadedOrder');
        //     this.contractorsFireBase.doc(order.data().contractor.key).get().then((contractor) => {
        //         this.onValUpdate(contractor.data(), 'contractor');
        //         this.onValUpdate(true, 'loadedContractor');
        //     });
        //     this.carriersFireBase.doc(order.data().carrier).get().then((carrier) => {
        //         this.onValUpdate(carrier.data(), 'carrier');
        //     });
        // });
        //
        // db.collection('ordersProducts')
        //     .where('order', '==', orderKey).get().then(querySnapshot => {
        //     querySnapshot.forEach((doc) => {
        //         const productKey = doc.data().product
        //         arrayProductKey.push({
        //             productKey: doc.data().product,
        //             amount: doc.data().amount,
        //         })
        //     });
        // }).then( () =>{
        //     //console.log(arrayProductKey)
        //     const elements = []
        //     let weight = 0
        //     arrayProductKey.map((res, i) => {
        //         db.collection('products').doc(res.productKey).get().then((resc) => {
        //             const element = resc.data();
        //             element['amount'] = res.amount
        //             element['key'] = res.productKey
        //             weight += (parseFloat(res.amount) * parseFloat(element.weight));
        //             elements.push(element)
        //         }).then(() =>{
        //             this.onValUpdate(elements, 'AllProducts')
        //             this.onValUpdate(weight, 'fullWeight')
        //             this.onValUpdate(true, 'loadedProduct')
        //         })
        //     })

        //
        //
        // });
        // this.onValUpdate(arrayProductKey, 'orderProductKeys')
        //
        // this.unsubscribeProducts = this.productsFireBase.onSnapshot(this.fetchCollectionProducts)
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

            this.onValUpdate(true, 'loadedOrder');
            const firestore = getFirestore()
            let contractorDoc = doc(firestore,'contractors',element.contractor.key);
            const contractorSnap = await getDoc(contractorDoc);
            if(contractorSnap.exists){
                this.onValUpdate(contractorSnap.data(), 'contractor');
                this.onValUpdate(true, 'loadedContractor');
            }

            let carriersDoc = doc(firestore,'carriers',element.carrier);
            const carriersSnap = await getDoc(carriersDoc);
            if(carriersSnap.exists){
                this.onValUpdate(carriersSnap.data(), 'carrier');
            }
        } else {
            // this.props.navigation.navigate('ProductList')
        }
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

    // async orderProduct(){
    //     const orderKey = this.state.orderKey;
    //     //console.log(orderKey);
    //     const arrayProduct = []
    //     const arrayProductKey = []
    //     const q = query(this.ordersProductsCollection, where('order', '==', orderKey));
    //     let allOrdersProducts = await getDocs(q);
    //
    //     allOrdersProducts.forEach((res) => {
    //         const productKey = res.data().product
    //         arrayProductKey.push({
    //             productKey: res.data().product,
    //             amount: res.data().amount,
    //         })
    //     });
    //     console.log(arrayProductKey)
    //     const firestore = getFirestore()
    //     const elements = []
    //
    //     arrayProductKey.map(async (res, i) => {
    //         let productCurrentKey = doc(firestore, 'products', res.productKey);
    //
    //         const productSnap = await getDoc(productCurrentKey);
    //         if (productSnap.exists) {
    //             const element = productSnap.data();
    //             element['amount'] = res.amount
    //             element['key'] = res.productKey
    //             elements.push(element)
    //         }
    //
    //         this.onValUpdate(elements,'choosedProducts')
    //     });
    //
    //     this.onValUpdate(arrayProductKey, 'orderProductKeys')
    // }

    async orderProduct(){

        const orderKey = this.state.orderKey;

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
            })
        });
        const firestore = getFirestore()
        const elements = []
        let weight = 0
        let weightFull = 0;
        arrayProductKey.map(async (res, i) => {
            let productCurrentKey = doc(firestore, 'products', res.productKey);

            const productSnap = await getDoc(productCurrentKey);
            if (productSnap.exists) {
                const element = productSnap.data();
                weight = (parseFloat(res.amount) * parseFloat(element.weight));
                element['amount'] = res.amount
                element['key'] = res.productKey
                weightFull += weight
                elements.push(element)
            }
            this.onValUpdate(weightFull, 'fullWeight')

            this.onValUpdate(elements,'choosedProducts')
        });

        this.onValUpdate(elements, 'AllProducts')
        this.onValUpdate(true, 'loadedProduct')
        this.onValUpdate(arrayProductKey, 'orderProductKeys')
    }

    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    alertInfoRamp =  ()  =>{
        if(this.state.loadedOrder){
            if(this.state.order.ramp === 0 || this.state.order.ramp === undefined){
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


            function reverseWords(sentence) {
                // Podziel zdanie na poszczególne słowa
                const words = sentence.split(' ');

                // Zamień każde słowo na odwrotność
                const reversedWords = words.map(word => {
                    return word.split('').reverse().join('');
                });

                // Połącz słowa w jedno zdanie
                return reversedWords.join(' ');
            }


            
