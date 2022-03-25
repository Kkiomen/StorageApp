import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import SignInScreen from "./src/screens/SignInScreen";
import DashboardScreen from "./src/screens/DashboardScreen";

const navigator = createStackNavigator(
    {
      SignIn: SignInScreen,
      Dashboard: DashboardScreen
    },
    {
      initialRouteName: "SignIn",
      defaultNavigationOptions: {
        title: "App",
      },
    }
);

export default createAppContainer(navigator);