import React, {Component} from 'react'
import {StyleSheet, View, ScrollView, Button, Text, Modal, Pressable} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";

class SearchProductScreen extends Component {

    constructor({props, navigation}) {
        super();

    }

    componentDidMount() {
    }

    render() {
        if (this.state.hasPermission === null) {
            return <Text>Requesting for camera permission</Text>;
        }
        if (this.state.hasPermission === false) {
            return <Text>No access to camera</Text>;
        }

        return (
            <ScrollView style={styles.wrapper}>
                <CustomInput
                    placeholder="Search .."
                    value={this.state.searchText}
                    setValue={(val) => this.search(val, 'searchText')}
                    style={styles.searchInput}
                />
            </ScrollView>
        );
    }
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
    modalCenter: {
        //alignItems: "center",
        paddingHorizontal: 35,
        paddingBottom: 35,
    },
});
export default SearchProductScreen;
