import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useEffect} from "react";
import {Col, Grid} from "react-native-easy-grid";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCircleInfo, faLocationDot, faPhone} from "@fortawesome/free-solid-svg-icons";

const InformationAboutDelivery = ({status,contractor}) => {

    useEffect(() => {

    });

    if(status){


        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View>
                        <Grid>
                            <Col size={1} style={styles.colLeft}>
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                    style={styles.iconLeft}
                                    size={28}
                                />
                            </Col>
                            <Col size={9}>
                                <Text style={[styles.cardTitle, styles.textLeft, styles.ps10]}>Information</Text>
                            </Col>
                        </Grid>
                    </View>
                    <View style={styles.cardBody}>
                        <Grid>
                            <Col size={1} style={styles.colLeft}>
                                <FontAwesomeIcon
                                    icon={faLocationDot}
                                    style={styles.iconLeft}
                                    size={18}
                                />
                            </Col>
                            <Col size={9}>
                                <Text style={[styles.cardTitle, styles.textLeft, styles.titleSmall]}>Address</Text>
                            </Col>
                        </Grid>
                        <Text style={styles.cardText} selectable={true}>{contractor.delivery.address}{"\n"}{contractor.delivery.postCode} { contractor.delivery.city} {"\n"}{contractor.delivery.country}</Text>
                        {/*<Grid style={styles.gridMargin}>*/}
                        {/*    <Col size={1} style={styles.colLeft}>*/}
                        {/*        <FontAwesomeIcon*/}
                        {/*            icon={faPhone}*/}
                        {/*            style={styles.iconLeft}*/}
                        {/*            size={18}*/}
                        {/*        />*/}
                        {/*    </Col>*/}
                        {/*    <Col size={9}>*/}
                        {/*        <Text style={[styles.cardTitle, styles.textLeft, styles.titleSmall]}>Phone</Text>*/}
                        {/*    </Col>*/}
                        {/*</Grid>*/}
                        {/*<Text style={styles.cardText}>{contractor.phone}</Text>*/}
                    </View>
                </View>

            </View>
        );
    }else{
        return(
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="green"/>
            </View>
        )
    }



}

const styles = StyleSheet.create({
    card:{
        backgroundColor: "#28242c",
        padding: 20
    },
    cardHeader:{
        color: "white"
    },
    cardText:{
        color: "white"
    },
    cardBody:{
        paddingTop: 15,
        color: "white"
    },
    cardTitle:{
        fontWeight: "bold",
        fontSize: 38,
        color: "white"
    },
    iconLeft:{
        color: "white",
    },
    textLeft:{
        fontSize: 20,
        textAlign: "left",

    },
    titleSmall:{
        fontSize: 16
    },
    ps10:{
        paddingStart: 10
    },
    colLeft:{
        paddingBottom: 10
    },
    gridMargin:{
        marginTop:20
    }
});

export default InformationAboutDelivery;
