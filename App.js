import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SignInScreen from "./src/screens/SignInScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProductsCreatScreen from "./src/screens/Products/ProductCreateScreen";
import TakePhotoScreen from "./src/screens/TakePhoto";
import BarcodeScreen from "./src/screens/BarcodeScreen";
import ProductListScreen from "./src/screens/Products/ProductListScreen";
import ProductEditScreen from "./src/screens/Products/ProductEditScreen";

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
    },
    {
      initialRouteName: "SignIn",
      defaultNavigationOptions: {
        title: "App",
      },
    }
);

export default createAppContainer(navigator);
