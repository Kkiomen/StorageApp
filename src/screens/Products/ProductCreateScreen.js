import React, {Component,useState, useContext} from 'react'
import {Button, StyleSheet, ScrollView, ActivityIndicator, View, TextInput, Platform,} from "react-native";
import firebase from "../../../firebase";
import storage from "firebase/compat";
import CustomInput from "../../components/CustomInput/CustomInput";

class ProductsCreatScreen extends Component{

    constructor({props,navigation}) {
        super();
        this.ref = firebase.firestore().collection('students');
        let tmp = navigation.getParam('data')
        if(typeof tmp !== 'undefined'){
            this.state = {
                name: tmp.name,
                sector: tmp.sector,
                barcode: tmp.barcode,
                designation: '',
                isLoading: false
            };
        }else{
            this.state = {
                name: '',
                sector:  '',
                barcode: '',
                designation: '',
                isLoading: false
            };
        }
    }

    test = () => {
        this.props.navigation.navigate('BarcodeScan', {data: this.state})
    }


    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    //https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/
    addStudent() {
        if(this.state.name === ''){
            alert('Name is required.')
        } else {
            this.setState({
                isLoading: true,
            });
            this.ref.add({
                name: this.state.name,
                designation: this.state.designation,
            }).then((res) => {
                this.setState({
                    name: '',
                    designation: '',
                    isLoading: false,
                });
                this.props.navigation.navigate('ReadComponent')
            })
                .catch((err) => {
                    console.error("Error occured: ", err);
                    this.setState({
                        isLoading: false,
                    });
                });
        }
    }

    render() {
        if(this.state.isLoading){
            return(
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="green"/>
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={styles.formEle}>
                    <CustomInput
                        placeholder="name"
                        value={this.state.name}
                        setValue={(val) => this.onValUpdate(val, 'name')}
                    />
                    <CustomInput
                        placeholder="Sector"
                        value={this.state.sector}
                        setValue={(val) => this.onValUpdate(val, 'sector')}
                    />

                    <CustomInput
                        placeholder="Barcode"
                        value={this.state.barcode}
                    />
                    {/*<TextInput*/}
                    {/*    placeholder={'Name'}*/}
                    {/*    value={this.state.name}*/}
                    {/*    onChangeText={(val) => this.onValUpdate(val, 'name')}*/}
                    {/*/>*/}
                </View>
                <View style={styles.formEle}>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        placeholder={'Designation'}
                        value={this.state.designation}
                        onChangeText={(val) => this.onValUpdate(val, 'designation')}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title='Create'
                        onPress={() => this.addStudent()}
                        color="black"
                    />

                    <Button
                        title='TakePhoto'
                        onPress={() => this.test()}
                        color="black"
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formEle:{
        alignItems: 'center',
        padding: 20
    }
});

export default ProductsCreatScreen;

