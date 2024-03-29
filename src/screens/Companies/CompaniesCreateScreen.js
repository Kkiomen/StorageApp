import React, {Component} from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Button} from "react-native";
import firebase, {db} from "../../../firebase";
import types from "./type";
import CustomInput from "../../components/CustomInput/CustomInput";
import Toast from "react-native-toast-message";
import {Placeholder} from "react-bootstrap";
import CustomHeaderForm from "../../components/CustomHeaderForm/CustomHeaderForm";
import {
    addDoc,
    collection,
} from "firebase/firestore";

const TypeEnum = types

class CompaniesCreateScreen extends Component {

    constructor({props, navigation}) {
        super();
        this.companyCollection = collection(db, navigation.getParam('type').toLowerCase());

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
        if (navigation.getParam('type') === "CARRIERS") {
            this.name = TypeEnum.CARRIERS
        } else if (navigation.getParam('type') === "CONTRACTORS") {
            this.name = TypeEnum.CONTRACTORS
        }
    }

    isPhoneNumber(str) {
        var phoneNumberRegex = /^\d{9}$/;
        return phoneNumberRegex.test(str);
    }

    isNIP(str) {
        var phoneNumberRegex = /^\d{10}$/;
        return phoneNumberRegex.test(str);
    }


    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    addNewCompanies() {
        if (
            this.state.name === '' || this.state.address === '' || this.state.postCode === '' || this.state.city === '' || this.state.country === '' || this.state.email === '') {
            Toast.show({
                type: 'error',
                text1: 'An error has occurred',
                text2: 'All fields must be completed',
                position: "bottom",
                bottomOffset: 70
            });
            return false;
        }

        if (!this.isPhoneNumber(this.state.phone) && this.state.phone !== '') {
            Toast.show({
                type: 'error',
                text1: 'An error has occurred',
                text2: 'The phone field is not a valid phone number. The correct one should consist of 9 digits',
                position: "bottom",
                bottomOffset: 70

            });
            return false;
        }

        if (!this.isPhoneNumber(this.state.phone) && this.state.phone !== '') {
            Toast.show({
                type: 'error',
                text1: 'An error has occurred',
                text2: 'The phone field is not a valid phone number. The correct one should consist of 9 digits',
                position: "bottom",
                bottomOffset: 70

            });
            return false;
        }

        this.setState({
            isLoading: true,
        });

        addDoc(this.companyCollection, {
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
                text1: 'Something went wrong. Try again later',
                position: 'bottom',
                bottomOffset: 70
            });
        });

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


                    <Text style={styles.label}>Company name</Text>
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

                    <Text style={styles.label}>Owner's firstname and secondname</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.owner}
                        setValue={(val) => this.onValUpdate(val, 'owner')}
                        style={styles.marginBottom}
                    />

                    <CustomHeaderForm title="Company address"/>

                    <Text style={styles.label}>Adress</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.address}
                        setValue={(val) => this.onValUpdate(val, 'address')}
                    />

                    <Text style={styles.label}>Zip code</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.postCode}
                        setValue={(val) => this.onValUpdate(val, 'postCode')}
                    />

                    <Text style={styles.label}>City</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.city}
                        setValue={(val) => this.onValUpdate(val, 'city')}
                    />

                    <Text style={styles.label}>Country</Text>
                    <CustomInput
                        placeholder=""
                        value={this.state.country}
                        setValue={(val) => this.onValUpdate(val, 'country')}
                        style={styles.marginBottom}
                    />

                    <CustomHeaderForm title="Contact details"/>

                    <Text style={styles.label}>Phone Number</Text>
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

                    <View style={styles.button}>
                        <Button
                            title='Add new company'
                            onPress={() => this.addNewCompanies()}
                            color="black"
                            style={styles.buttonCreate}
                        />
                    </View>

                </View>


                <Toast style={styles.toast}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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
});

export default CompaniesCreateScreen;

