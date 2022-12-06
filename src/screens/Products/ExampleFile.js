import React, {Component} from 'react'
import {StyleSheet, View, ScrollView, Button, Text, Modal, Pressable} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import {doc, getDoc, getFirestore} from "firebase/firestore";

class SearchProductScreen extends Component {

    constructor({props, navigation}) {
        super();

    }

    componentDidMount() {
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
});
export default SearchProductScreen;








allOrdersProducts.forEach((res) => {
    const productKey = res.data().product
    arrayProductKey.push({
        productKey: res.data().product,
        amount: res.data().amount,
    })
}).then( () =>{
    console.log(productKey)
    const elements = []
    const firestore = getFirestore()
    arrayProductKey.map(async (resc, i) => {
        let productCurrentKey = doc(firestore, 'products', res.productKey);
        const productSnap = await getDoc(productCurrentKey);
        if (productSnap.exists) {
            const element = resc.data();
            element['amount'] = res.amount
            element['key'] = res.productKey
            elements.push(element)
            this.onValUpdate(elements, 'choosedProducts')
        }
    })
});
this.onValUpdate(arrayProductKey, 'orderProductKeys')



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
