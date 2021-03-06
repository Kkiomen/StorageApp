import React, {Component} from 'react'
import {StyleSheet, ScrollView, ActivityIndicator, View, Button} from 'react-native';
import firebase from "../../../firebase";
import { ListItem } from 'react-native-elements'
import {SearchBar} from "react-native-screens";
import CustomInput from "../../components/CustomInput/CustomInput";
class ProductListScreen extends Component{

    constructor() {
        super();
        this.docs = firebase.firestore().collection('products')
        this.state = {
            isLoading: true,
            products: [],
            AllProducts: [],
            searchText: ''
        };
    }

    componentDidMount() {
        this.unsubscribe = this.docs.onSnapshot(this.fetchCollection)
    }

    componentWillUnmount(){
        //this.unsubscribe();
    }

    fetchCollection = (querySnapshot) => {
        const products = [];
        querySnapshot.forEach((res) => {
            const { name, weight, type_package } = res.data()
            products.push({
                key: res.id,
                name,
                weight,
                type_package
            });
        });
        this.setState({
            products,
            isLoading: false
        });
        this.onValUpdate(products,'AllProducts')
    }

    onValUpdate = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)
    }

    search = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)

        if(state[prop].length === 0){
            this.onValUpdate(this.state.AllProducts, 'products')
        }else{
            let newArray = this.state.products.filter(function (el)
                {
                    return el.name.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'products');
        }
    }

    navigateToProductAdd = () => {
        this.props.navigation.navigate('ProductsCreate')
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="red"/>
                </View>
            )
        }
        return (
            <ScrollView style={styles.wrapper}>
                <View style={styles.buttonAddView}>
                    <Button
                        title='+ Add new product'
                        color="black"
                        onPress={() => this.navigateToProductAdd()}
                    />
                </View>

                <CustomInput
                    placeholder="Search .."
                    value={this.state.searchText}
                    setValue={(val) => this.search(val, 'searchText')}
                    style={styles.searchInput}
                />

                {
                    this.state.products.map((res, i) => {
                        return (
                            <ListItem
                                key={i}
                                onPress={() => {
                                    this.props.navigation.navigate('ProductEdit', {
                                        userkey: res.key
                                    });
                                }}
                                bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{res.name}</ListItem.Title>
                                    <ListItem.Subtitle>{res.weight}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron
                                    color="black"
                                />
                            </ListItem>
                        );
                    })
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        padding: 20
    },
    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    searchInput:{
        marginBottom: 20
    },
    buttonAddView:{
      alignItems: "flex-end"
    },
})

export default ProductListScreen;

