import React, {Component} from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Button} from "react-native";
import firebase from "../../../firebase";
import types from "./type";
import CustomInput from "../../components/CustomInput/CustomInput";
import Toast from "react-native-toast-message";
import {Placeholder} from "react-bootstrap";
import CustomHeaderForm from "../../components/CustomHeaderForm/CustomHeaderForm";


const TypeEnum = types

class CompaniesCreateScreen extends Component{

    constructor({props, navigation}) {
        super();
        this.ref = firebase.firestore().collection(navigation.getParam('type').toLowerCase())
        let tmp = navigation.getParam('data')
        this.state = {
            type: navigation.getParam('type'),
            name: '',
            address: '',
            postCode: '',
            city: '',
            country: '',
            phone: '',
            nip: '',
            email: '',
            owner: '',
            isLoading: false
        };
        if(navigation.getParam('type') === "CARRIERS"){
            this.name = TypeEnum.CARRIERS
        }else if(navigation.getParam('type') === "CONTRACTORS"){
            this.name = TypeEnum.CONTRACTORS
        }
    }

    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    addNewCompanies(){
        if (
            this.state.name === '' ||
            this.state.address === '' ||
            this.state.postCode === '' ||
            this.state.city === '' ||
            this.state.country === '' ||
            this.state.email === ''
        ) {
            Toast.show({
                type: 'error',
                text1: 'Wystąpił błąd',
                text2: 'Wszystkie pola muszą zostać wypełnione',
                position: "bottom"
            });

        } else {
            this.setState({
                isLoading: true,
            });
            this.ref.add({
                name: this.state.name,
                address: this.state.address,
                postCode: this.state.postCode,
                city: this.state.city,
                country: this.state.country,
                phone: this.state.phone,
                nip: this.state.nip,
                email: this.state.email,
                owner: this.state.owner,
            }).then((res) => {
                this.props.navigation.navigate('CompaniesList')
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Coś poszło nie tak. Spróbuj ponownie później',
                });
            });
        }
    }


    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="green"/>
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Text>{this.name}</Text>
                </View>
                <View style={styles.formEle}>


                    <Text style={styles.label}>Nazwa firmy</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.name}
                        setValue={(val) => this.onValUpdate(val, 'name')}
                    />

                    <Text style={styles.label}>NIP</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.nip}
                        setValue={(val) => this.onValUpdate(val, 'nip')}
                        style={styles.marginBottom}
                    />

                    <Text style={styles.label}>Imię i nazwisko właściciela</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.owner}
                        setValue={(val) => this.onValUpdate(val, 'owner')}
                        style={styles.marginBottom}
                    />

                    <CustomHeaderForm title="Adres firmy" />

                    <Text style={styles.label}>Adres</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.address}
                        setValue={(val) => this.onValUpdate(val, 'address')}
                    />

                    <Text style={styles.label}>Kod pocztowy</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.postCode}
                        setValue={(val) => this.onValUpdate(val, 'postCode')}
                    />

                    <Text style={styles.label}>Miasto</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.city}
                        setValue={(val) => this.onValUpdate(val, 'city')}
                    />

                    <Text style={styles.label}>Kraj</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.country}
                        setValue={(val) => this.onValUpdate(val, 'country')}
                        style={styles.marginBottom}
                    />

                    <CustomHeaderForm title="Dane kontaktowe" />

                    <Text style={styles.label}>Numer Telefonu</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.phone}
                        setValue={(val) => this.onValUpdate(val, 'phone')}
                    />

                    <Text style={styles.label}>E-mail</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.email}
                        setValue={(val) => this.onValUpdate(val, 'email')}
                    />


                </View>

                <View style={styles.button}>
                    <Button
                        title='Dodaj nową firmę'
                        onPress={() => this.addNewCompanies()}
                        color="black"
                        style={styles.buttonCreate}
                    />


                </View>
                <Toast style={styles.toast}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    header:{
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
    marginBottom:{
        marginBottom: 30
    },
});

export default CompaniesCreateScreen;

