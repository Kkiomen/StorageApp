import React, {Component} from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Button} from "react-native";
import firebase, {db} from "../../../firebase";
import CustomInput from "../../components/CustomInput/CustomInput";
import {ListItem} from "react-native-elements";
import types from "./type";
import { collection, getDocs } from "firebase/firestore";
import Toast from "react-native-toast-message";

const TypeEnum = types


class CompaniesListScreen extends Component{

    constructor({props, navigation}) {
        super();
        this.carriers = collection(db, "carriers");
        this.contractors = collection(db, "contractors");
        if(navigation.getParam('type') === "CARRIERS"){
            this.name = TypeEnum.CARRIERS
        }else if(navigation.getParam('type') === "CONTRACTORS"){
            this.name = TypeEnum.CONTRACTORS
        }


        this.state = {
            isLoading: true,
            companies: [],
            AllCompanies: [],
            searchText: '',
            type: navigation.getParam('type')
        };

        if(navigation.getParam('type') === "CARRIERS"){
            this.fetchCompanies(this.carriers);
        }else if(navigation.getParam('type') === "CONTRACTORS"){
            this.fetchCompanies(this.contractors);
        }


    }

    useLayoutEffect() {
        this.navigation.setOptions({headerShown: true, title: 'gdfdfg'});
    }

    async fetchCompanies(type) {
        const companies = [];
        try {
            let allCompaniesCollections = await getDocs(type);

            allCompaniesCollections.forEach((res) => {
                const {name, nip, city} = res.data()
                companies.push({
                    key: res.id,
                    name,
                    nip,
                    city
                });
            })
            this.setState({
                companies,
                isLoading: false,
                AllCompanies: companies
            });
        } catch (err) {
            console.log(err)
            Toast.show({
                type: 'error',
                text1: 'There was a problem while downloading carriers, try again later',
            });
        }
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
            this.onValUpdate(this.state.AllCompanies, 'companies')
        }else{
            let newArray = this.state.companies.filter(function (el)
                {
                    return el.name.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'companies');
        }
    }


    navigateToCompanyAdd = () => {
        this.props.navigation.navigate('CompaniesCreate', {type: this.props.navigation.getParam('type')})
    }

    render() {
        if(this.state.isLoading ){
            return(
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="red"/>
                </View>
            )
        }
        return (
            <ScrollView style={styles.wrapper}>
                <View style={styles.header}>
                    <Text>{this.name}</Text>
                </View>

                <View style={styles.buttonAddView}>
                    <Button
                        title='+ Add company'
                        style={styles.buttonAdd}
                        onPress={() => this.navigateToCompanyAdd()}
                    />
                </View>

                <CustomInput
                    placeholder="Search .."
                    value={this.state.searchText}
                    setValue={(val) => this.search(val, 'searchText')}
                    style={styles.searchInput}
                />

                {
                    this.state.companies.map((res, i) => {
                        return (
                            <ListItem
                                key={i}
                                onPress={() => {
                                    this.props.navigation.navigate('CompaniesEdit', {
                                        key: res.key,
                                        type: this.state.type
                                    });
                                }}
                                bottomDivider>
                                <ListItem.Content>
                                    <ListItem.Title>{res.name}</ListItem.Title>
                                    <ListItem.Subtitle>{res.nip} - {res.city}</ListItem.Subtitle>
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
    buttonAdd:{
        color: 'black'
    },
    header:{
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        marginBottom: 20,
        backgroundColor: "white"
    }
})


export default CompaniesListScreen;

