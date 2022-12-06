import React, {useState, useEffect, Component} from 'react'
import {StyleSheet, View, Text, Button, ScrollView, ActivityIndicator} from "react-native";
import firebase, {db} from "../../../firebase";
import CustomInput from "../../components/CustomInput/CustomInput";
import {ListItem} from "react-native-elements";
import { collection, getDocs, onSnapshot, doc } from "firebase/firestore";

import {isLoading} from "expo-font";
import Toast from "react-native-toast-message";
class DocumentsListScreen extends Component{

    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    constructor({props, navigation}) {
        super();
        this.docs = getDocs(collection(db, "documents"));
        this.state = {
            documentList: [],
            documentListAll: [],
            isLoading: false,
            searchText: '',
            isDeleted: false
        };
        this.fetchDocument();
    }


    componentDidMount() {
        this.fetchDocument();
    }


    async fetchDocument() {
        const documents = [];
        try {
            const productsRef = collection(db, 'documents');
            let allDocuments = await getDocs(productsRef);
            allDocuments.forEach((res) => {
                const { documentNumber,created_at, type,user} = res.data()
                documents.push({
                    key: res.id,
                    documentNumber,
                    created_at,
                    type,
                    user,
                });
            })
            this.onValUpdate(documents,'documentList')
            this.onValUpdate(documents,'documentListAll')
            this.onValUpdate(true, 'isLoading')
        } catch (err) {
            console.log(err)
            Toast.show({
                type: 'error',
                text1: 'Wystąpił problem podczas pobierania produktów, spróbuj ponownie później',
            });
        }
    }




    search = (val, prop) => {
        const state = this.state
        state[prop] = val
        this.setState(state)

        if(state[prop].length === 0){
            this.onValUpdate(this.state.documentListAll, 'documentList')
        }else{
            let newArray = this.state.documentList.filter(function (el)
                {
                    return el.documentNumber.toLowerCase().includes(state[prop].toLowerCase())
                }
            );
            this.onValUpdate(newArray, 'documentList');
        }
    }


    render() {
        if(!this.state.isLoading){
            return(
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="green"/>
                </View>
            )
        }

        return (
            <View style={styles.wrapper}>
                <CustomInput
                    placeholder="Document number .."
                    value={this.state.searchText}
                    setValue={(val) => this.search(val, 'searchText')}
                    style={styles.searchInput}
                />
                <ScrollView>
                    {
                        this.state.documentList.map((res, i) => {

                            return (
                                <ListItem
                                    id={i}
                                    onPress={() => {
                                        this.props.navigation.navigate('DocumentInfo', {
                                            documentKey: res.key
                                        });
                                    }}
                                    bottomDivider>
                                    <ListItem.Content>
                                        <ListItem.Title>Invoice no. {res.documentNumber}/2023</ListItem.Title>
                                        <ListItem.Subtitle>
                                            {res.type == 'ISSUES' ? "ISSUES" : "Acceptance"} - {res.created_at.toDate().toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ")}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron
                                        color="black"
                                    />
                                </ListItem>
                            );
                        })
                    }
                </ScrollView>

            </View>
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
});

export default DocumentsListScreen;

