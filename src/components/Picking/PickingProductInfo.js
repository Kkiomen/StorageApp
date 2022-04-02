import {StyleSheet,Text, TextInput, View} from "react-native";
import React from "react";
import InfoField from "../CustomInput/InfoField";

const PickingProductInfo = ({product}) => {
    return (
        <View style={styles.container}>
            <InfoField label="Produkt" text={product.name} />
            <InfoField label="Ilość" text={product.amount} />
            <InfoField label="Sektor" text={product.sector} />
            <InfoField label="Typ" text={product.type_package} />
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
