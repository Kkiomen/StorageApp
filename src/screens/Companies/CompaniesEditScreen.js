import React, {Component} from 'react'
import {StyleSheet, View, Text, ActivityIndicator, ScrollView, Button} from "react-native";
import firebase from "../../../firebase";
import types from "./type";
import CustomInput from "../../components/CustomInput/CustomInput";
import Toast from "react-native-toast-message";
import {Placeholder} from "react-bootstrap";
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

const TypeEnum = types

class CompaniesEditScreen extends Component{

    constructor({props, navigation}) {
        super();
        const firestore = getFirestore()
        this.companyDoc = doc(firestore,navigation.getParam('type').toLowerCase(),navigation.getParam('key'));
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
        this.fetchCompany();
    }

    componentDidMount() {
        this.fetchCompany();
    }

    async fetchCompany() {
        const companySnap = await getDoc(this.companyDoc);
        if (companySnap.exists) {
            const element = companySnap.data();
            this.setState({
                key: companySnap.id,
                name: element.name,
                address: element.address,
                postCode: element.postCode,
                city: element.city,
                country: element.country,
                phone: element.phone,
                nip: element.nip,
                email: element.email,
                owner: element.owner,
                isLoading: false
            });
        } else {
            this.props.navigation.navigate('CompaniesList')
        }
    }

    onValUpdate = (val, prop) => {
        const state = this.state;
        state[prop] = val;
        this.setState(state);
    }

    editCompanies(){
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
                text1: 'An error has occurred',
                text2: 'All fields must be completed',
                position: "bottom"
            });

        } else {
            updateDoc(this.companyDoc,{
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
                Toast.show({
                    type: 'success',
                    text1: 'The data has been updated',
                    position: "bottom",
                    bottomOffset: 70
                });
            }).catch((err) => {
                Toast.show({
                    type: 'error',
                    text1: 'Something went wrong. Try again later',
                    position: "bottom",
                    bottomOffset: 70
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

                    <CustomHeaderForm title="Company address" />

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

                    <CustomHeaderForm title="Contact details" />

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
                            title='Edit company'
                            onPress={() => this.editCompanies()}
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

export default CompaniesEditScreen;

