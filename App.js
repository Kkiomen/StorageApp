import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SignInScreen from "./src/screens/SignInScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProductsCreatScreen from "./src/screens/Products/ProductCreateScreen";
import TakePhotoScreen from "./src/screens/TakePhoto";
import BarcodeScreen from "./src/screens/BarcodeScreen";
import ProductListScreen from "./src/screens/Products/ProductListScreen";
import ProductEditScreen from "./src/screens/Products/ProductEditScreen";
import CompaniesListScreen from "./src/screens/Companies/CompaniesListScreen";
import CompaniesCreateScreen from "./src/screens/Companies/CompaniesCreateScreen";
import CompaniesEditScreen from "./src/screens/Companies/CompaniesEditScreen";
import OrdersCreateScreen from "./src/screens/Orders/OrdersCreateScreen";
import OrdersListScreen from "./src/screens/Orders/OrdersListScreen";
import OrdersEditScreen from "./src/screens/Orders/OrdersEditScreen";
import PickingListScreen from "./src/screens/Picking/PickingListScreen";
import PickingCollectScreen from "./src/screens/Picking/PickingCollectScreen";
import SearchProductScreen from "./src/screens/Products/SearchProductScreen";
import CarrierInformation from "./src/screens/Carriers/CarrierInformation";
import {decode, encode} from 'base-64'
import AcceptanceCreateScreen from "./src/screens/Acceptance/AcceptanceCreateScreen";
import DocumentsListScreen from "./src/screens/Acceptance/DocumentsListScreen";
import DocumentInfoScreen from "./src/screens/Acceptance/DocumentInfoScreen";
import PickColl from "./src/screens/Picking/PickingCollectScreen";
import PickCollScreen from "./src/screens/Picking/PickColl";


const navigator = createStackNavigator(
    {
      SignIn: SignInScreen,
      Dashboard: {
          screen: DashboardScreen,
          navigationOptions: () => ({
              headerShown: false
          }),
      },
      ProductsCreate: {
          screen: ProductsCreatScreen,
          navigationOptions: () => ({
              title: "Add new product",
          }),
      },
      TakePhoto: TakePhotoScreen,
      BarcodeScan: {
          screen: BarcodeScreen,
          navigationOptions: () => ({
              headerShown: false,
          }),
      },
      ProductList: {
          screen: ProductListScreen,
          navigationOptions: () => ({
              title: "List of products",
          }),
      },
      ProductEdit: {
          screen: ProductEditScreen,
          navigationOptions: () => ({
              title: "Edit a product",
          }),
      },
      AcceptanceCreate: {
          screen: AcceptanceCreateScreen,
          navigationOptions: () => ({
              title: "Add new acceptance",
          }),
      },
      DocumentsList: {
          screen: DocumentsListScreen,
          navigationOptions: () => ({
              title: "Documents",
          }),
      },
      DocumentInfo:{
        screen: DocumentInfoScreen,
        navigationOptions: () => ({
            title: "Document information"
        })
      },
      IssuesCreate: {
          screen: AcceptanceCreateScreen,
          navigationOptions: () => ({
              title: "Add new issues",
          }),
      },
      CompaniesList: {
          screen: CompaniesListScreen,
          navigationOptions: () => ({
              title: "List of companies",
          }),
      },
      CompaniesCreate:{
          screen: CompaniesCreateScreen,
          navigationOptions: () => ({
              title: "Add new company"
          })
      },
        CompaniesEdit:{
            screen: CompaniesEditScreen,
            navigationOptions: () => ({
                title: "Edit company"
            })
        },
        OrderCreate:{
            screen: OrdersCreateScreen,
            navigationOptions: () => ({
                title: "Add order"
            })
        },
        OrdersList:{
            screen: OrdersListScreen,
            navigationOptions: () => ({
                title: "Order list"
            })
        },
        OrdersEdit:{
            screen: OrdersEditScreen,
            navigationOptions: () => ({
                title: "Edit order"
            })
        },
        PickingList: {
            screen: PickingListScreen,
            navigationOptions: () => ({
                title: "List of orders to complete",
            }),
        },
        PickColl: {
            screen: PickCollScreen,
            navigationOptions: () => ({
                title: "Orders to complete",
            }),
        },
        PickingCollect: {
            screen: PickingCollectScreen,
            navigationOptions: () => ({
                title: "Order completion",
            }),
        },
        SearchProduct: {
            screen: SearchProductScreen,
            navigationOptions: () => ({
                title: "Find Product",
            }),
        },
        CarrierInformation: {
            screen: CarrierInformation,
            navigationOptions: () => ({
                title: "Information about delivery",
            }),
        },
    },
    {
      initialRouteName: "SignIn",
      defaultNavigationOptions: {
        title: "App",
      },
    }
);


if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

export default createAppContainer(navigator);
