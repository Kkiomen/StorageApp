import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import React from "react";
import InfoField from "../CustomInput/InfoField";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faCar} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Grid } from "react-native-easy-grid";

const ButtonWithIcon = ({onPress,text,icon, textSmall, position= 'center'}) => {

    if(position === "center"){
        return (
            <Pressable
                onPress={onPress}
                style={styles.button}
            >
            { typeof icon !== 'undefined' ?     <FontAwesomeIcon
                    icon={icon}
                    style={styles.icon}
                    size={28}
                /> : null }
                <Text style={styles.text}>{text}</Text>
                { typeof textSmall !== 'undefined' ? <Text style={styles.textSmall}>{textSmall}</Text> : null}

            </Pressable>
        );
    }else{
        return (
            <Pressable
                onPress={onPress}
                style={[styles.button, styles.buttonLeft]}
            >
                <Grid>
                    <Col size={3} style={styles.colLeft}>
                        <FontAwesomeIcon
                            icon={icon}
                            style={styles.iconLeft}
                            size={28}
                        />
                    </Col>
                    <Col size={7}>
                        <Text style={[styles.text, styles.textLeft]}>{text}</Text>
                    </Col>
                </Grid>

            </Pressable>
        );
    }



}

const styles = StyleSheet.create({
    button:{
        backgroundColor: "black",
        alignItems: "center",
        padding: 5,
        margin: 4
    },
    text:{
        color: "white",
        marginTop: 3,
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 13
    },
    icon:{
        color: "white",
        marginTop: 8
    },
    textSmall:{
        color: "white",
        textTransform: "uppercase",
        fontSize: 8
    },
    buttonLeft:{
      paddingVertical: 20
    },
    iconLeft:{
        color: "white",
    },
    textLeft:{
        fontSize: 16,
        textAlign: "center"
    },
    colLeft:{
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ButtonWithIcon;
