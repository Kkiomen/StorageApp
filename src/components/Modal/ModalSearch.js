import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text, Pressable, ScrollView, Modal} from "react-native";
import CustomInput from "../CustomInput/CustomInput";

const ModalSearch = ({searchFunction, searchValue, onChoose, models, visible, props,navigation}) => {
    const [visibleModal, setVisibleModal] = useState(false)

    useEffect(() => {
        setVisibleModal(visible)
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visibleModal}
            onRequestClose={() => setVisibleModal(!visibleModal)}
        >
            <View style={styles.centeredView}>

                <View style={styles.modalView}>
                    <View style={styles.modalCloseView}>
                        <Pressable
                            style={styles.modalCloseView}
                            onPress={() => setVisibleModal(!visibleModal)}
                        >
                            <Text style={styles.textStyle}>X</Text>
                        </Pressable>
                    </View>
                    <View
                        style={styles.modalCenter}>
                        <CustomInput
                            placeholder="Szukaj .."
                            value={searchValue}
                            setValue={searchFunction}
                            style={styles.searchInput}
                        />
                        <ScrollView>
                            {
                                models.map((res, i) => {
                                    return (
                                        <View style={styles.listView}>
                                            <Pressable
                                                key={i}
                                                onPress={onChoose(res)}
                                            >
                                                <Text>{res.name}</Text>
                                            </Pressable>
                                        </View>
                                    );
                                })
                            }
                        </ScrollView>
                    </View>


                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalCenter:{
        //alignItems: "center",
        paddingHorizontal: 35,
        paddingBottom: 35,
    },
    modalCloseView:{
        alignItems:"flex-end",
        padding: 9
    },
    listView:{
        borderWidth: 1,
        borderColor: "#605e5e",
        borderRadius: 3,
        padding: 10,
        paddingHorizontal: 20,
        marginVertical: 5
    },
});

export default ModalSearch;

