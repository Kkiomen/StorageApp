import React from "react"
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import {auth} from "../../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    faAddressBook,
    faBox,
    faCartFlatbed,
    faClipboardList, faFileLines, faRightFromBracket, faRightToBracket,
    faSearch,
    faSignOut,
    faTruckFast,
    faTruckRampBox
} from "@fortawesome/free-solid-svg-icons";
import { Col, Grid } from "react-native-easy-grid";
import ButtonWithIcon from "../components/DashboardMenu/ButtonWithIcon";
import ButtonOutline from "../components/DashboardMenu/ButtonOutline";



const DashboardScreen = ({navigation}) => {

    const onSignOutPressed = () =>{
        auth
            .signOut()
            .then(() =>{
                navigation.navigate('SignIn')
            })
    }
    const onPressMenuOptionsProductList = () => {
        navigation.navigate('ProductList')
    }

     const onPressMenuOptionsContractor = (type) => {
        navigation.navigate('CompaniesList', {type: type})
    }

    const onPressMenuOptionsOrder = () => {
        navigation.navigate('OrdersList')
    }

    const onPressMenuOptionsPicking = (type) => {
        navigation.navigate('PickingList', {type: type})
    }

    const onPressMenuOptionsAcceptance = (type) => {
        if(type === 'ISSUES'){
            navigation.navigate('IssuesCreate', {type: type})
        }else{
            navigation.navigate('AcceptanceCreate', {type: type})
        }

    }

    const onPressMenuOptionsSearchProduct = () => {
        navigation.navigate('SearchProduct')
    }

    const onPressMenuOptionsNewOrder = () => {
        navigation.navigate('OrderCreate')
    }

    const onPressMenuOptionsDocument = () => {
        navigation.navigate('DocumentsList')
    }

    return (
        <View style={styles.root}>
            <View style={styles.logo}>
                <FontAwesomeIcon styles={styles.logoIcon} icon={faBox} size={45} />
                <Text style={styles.logoText}>Storage</Text>
            </View>
            <ScrollView>


                <ScrollView horizontal={true}>
                    <ButtonOutline
                        text="Orders to complete"
                        onPress={() => onPressMenuOptionsPicking('normal')}
                    />
                    <ButtonOutline
                        text="Add new order"
                        onPress={() => onPressMenuOptionsNewOrder()}
                    />
                    <ButtonOutline
                        text="Sign out"
                        onPress={() => onSignOutPressed()}
                    />
                </ScrollView>

                <ScrollView style={styles.container}>
                    <View style={styles.widthFull}>

                            <Col size={12}>
                                <ButtonWithIcon
                                    text="Find Product"
                                    icon={faSearch}
                                    onPress={() => onPressMenuOptionsSearchProduct()}
                                    position="left"
                                />
                            </Col>
                            <Col size={12}>
                                <ButtonWithIcon
                                    text="Products"
                                    icon={faBox}
                                    onPress={() => onPressMenuOptionsProductList()}
                                />
                            </Col>


                        <Grid>
                            <Col size={6}>
                                <ButtonWithIcon
                                    text="Acceptance"
                                    textSmall = "of goods"
                                    icon={faRightToBracket}
                                    onPress={() => onPressMenuOptionsAcceptance('ADOPTION')}
                                />
                            </Col>
                            <Col size={6}>
                                <ButtonWithIcon
                                    text="Issues"
                                    textSmall = "of goods"
                                    icon={faRightFromBracket}
                                    onPress={() => onPressMenuOptionsAcceptance('ISSUES')}
                                />
                            </Col>
                        </Grid>

                        <Grid>
                            <Col size={6}>
                                <ButtonWithIcon
                                    text="Carriers"
                                    icon={faTruckFast}
                                    onPress={() => onPressMenuOptionsContractor('CARRIERS')}
                                />
                            </Col>
                            <Col size={6}>
                                <ButtonWithIcon
                                    text="Contractors"
                                    icon={faAddressBook}
                                    onPress={() => onPressMenuOptionsContractor('CONTRACTORS')}
                                />
                            </Col>
                        </Grid>


                        <Grid>
                            <Col size={1}>
                                <ButtonWithIcon
                                    text="Manage Order"
                                    icon={faClipboardList}
                                    onPress={onPressMenuOptionsOrder}
                                />
                            </Col>
                        </Grid>


                        <Grid>
                            <Col size={6}>
                                <ButtonWithIcon
                                    text="To complete"
                                    textSmall = "order"
                                    icon={faCartFlatbed}
                                    onPress={() => onPressMenuOptionsPicking('normal')}
                                />
                            </Col>
                            <Col size={6}>
                                <ButtonWithIcon
                                    text="To complete"
                                    textSmall = "receipt of goods"
                                    icon={faTruckRampBox}
                                    onPress={() => onPressMenuOptionsPicking('accept')}
                                />
                            </Col>
                        </Grid>

                        <Grid>
                            <Col size={1}>
                                <ButtonWithIcon
                                    text="Documents"
                                    icon={faFileLines}
                                    onPress={onPressMenuOptionsDocument}
                                />
                            </Col>
                        </Grid>

                        <Grid>

                            <Col size={1}>
                                <ButtonWithIcon
                                    text="Sign out"
                                    icon={faSignOut}
                                    onPress={() => onSignOutPressed()}
                                    position="left"
                                />
                            </Col>
                        </Grid>

                    </View>
                </ScrollView>

            </ScrollView>
            {/*<Text>Logged</Text>*/}
            {/*<CustomButton*/}
            {/*    text="Log out"*/}
            {/*    onPress={onSignOutPressed}*/}
            {/*/>*/}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
        marginTop: 30,
        marginBottom: 30,
        paddingBottom: 40
    },
    logo:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginVertical: 20,
    },
    logoText:{
        fontWeight: '900',
        textTransform: 'uppercase',
        fontSize: 30,
        marginHorizontal: 10
    },
    logoIcon:{
        marginEnd: 20,
        marginTop: 40
    },
    button:{
        borderWidth: 1,
        padding: 20,
        marginEnd: 20,
    },
    buttonMargin:{
        marginVertical: 20,
        marginBottom: 30,
        marginTop: 30,
        padding: 10
    },
    menuButton:{
        padding: 10,
        width: 100
    },
    container:{
        marginTop: 15,
        alignSelf: 'stretch',
        marginBottom: 30
    },
});


export default DashboardScreen
