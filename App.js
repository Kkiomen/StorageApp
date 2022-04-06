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
              title: "Dodaj produkt",
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
              title: "Lista produktów",
          }),
      },
      ProductEdit: {
          screen: ProductEditScreen,
          navigationOptions: () => ({
              title: "Edytuj produkty",
          }),
      },
      CompaniesList: {
          screen: CompaniesListScreen,
          navigationOptions: () => ({
              title: "Lista firm",
          }),
      },
      CompaniesCreate:{
          screen: CompaniesCreateScreen,
          navigationOptions: () => ({
              title: "Dodaj nową firmę"
          })
      },
        CompaniesEdit:{
            screen: CompaniesEditScreen,
            navigationOptions: () => ({
                title: "Edytuj firmę"
            })
        },
        OrderCreate:{
            screen: OrdersCreateScreen,
            navigationOptions: () => ({
                title: "Dodaj zamówienie"
            })
        },
        OrdersList:{
            screen: OrdersListScreen,
            navigationOptions: () => ({
                title: "Lista zamówień"
            })
        },
        OrdersEdit:{
            screen: OrdersEditScreen,
            navigationOptions: () => ({
                title: "Edytuj zamówienie"
            })
        },
        PickingList: {
            screen: PickingListScreen,
            navigationOptions: () => ({
                title: "Lista zamówienień do skompletowania",
            }),
        },
        PickingCollect: {
            screen: PickingCollectScreen,
            navigationOptions: () => ({
                title: "Kompletowanie zamówienia",
            }),
        },
        SearchProduct: {
            screen: SearchProductScreen,
            navigationOptions: () => ({
                title: "Znajdź Produkt",
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

export default createAppContainer(navigator);
