import { Redirect } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
return  <Redirect href="/(auth)/welcome"></Redirect>;
};

export default Home;