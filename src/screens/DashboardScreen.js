import React from "react"
import {View, Text, StyleSheet, ScrollView} from 'react-native'
import {auth} from "../../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    faAddressBook,
    faBox,
    faCartFlatbed,
    faClipboardList,
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
    const onPressMenuOptions = () => {
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

    const onPressMenuOptionsSearchProduct = () => {
        navigation.navigate('SearchProduct')
    }

    const onPressMenuOptionsNewOrder = () => {
        navigation.navigate('OrderCreate')
    }

    return (
        <View style={styles.root}>
            <View style={styles.logo}>
                <FontAwesomeIcon styles={styles.logoIcon} icon={faBox} size={45} />
                <Text style={styles.logoText}>Storage</Text>
            </View>

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
                <Col size={1}>
                    <ButtonWithIcon
                        text="Find Product"
                        icon={faSearch}
                        onPress={() => onPressMenuOptionsSearchProduct()}
                        position="left"
                    />
                </Col>
                <Grid>
                    <Col size={10}>
                        <ButtonWithIcon
                            text="Products"
                            icon={faBox}
                            onPress={onPressMenuOptions}
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
                            text="Sign out"
                            icon={faSignOut}
                            onPress={() => onSignOutPressed()}
                            position="left"
                        />
                    </Col>
                </Grid>

            </View>








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
    },
});


export default DashboardScreen
