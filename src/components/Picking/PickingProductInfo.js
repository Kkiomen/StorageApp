import {StyleSheet,Text, TextInput, View} from "react-native";
import React from "react";
import InfoField from "../CustomInput/InfoField";

const PickingProductInfo = ({product}) => {
    return (
        <View style={styles.container}>
            <InfoField label="Product" text={product.name} />
            <InfoField label="Amount" text={product.amount} />
            <InfoField label="Sector" text={product.sector} />
            <InfoField label="Type" text={product.type_package} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginTop: 42
    },
});

export default PickingProductInfo;
