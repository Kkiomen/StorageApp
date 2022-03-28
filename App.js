import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SignInScreen from "./src/screens/SignInScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ProductsCreatScreen from "./src/screens/Products/ProductCreateScreen";
import TakePhotoScreen from "./src/screens/TakePhoto";
import BarcodeScreen from "./src/screens/BarcodeScreen";

const navigator = createStackNavigator(
    {
      SignIn: SignInScreen,
      Dashboard: {
          screen: DashboardScreen,
          navigationOptions: () => ({
              headerShown: false
          }),
      },
      ProductsCreate: ProductsCreatScreen,
      TakePhoto: TakePhotoScreen,
      BarcodeScan: BarcodeScreen,
    },
    {
      initialRouteName: "SignIn",
      defaultNavigationOptions: {
        title: "App",
      },
    }
);

export default createAppContainer(navigator);
