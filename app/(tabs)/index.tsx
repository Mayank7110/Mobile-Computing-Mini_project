import { SafeAreaViewBase, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="justify-center items-center">
      <Text className="text-red-400">Hello Jeee</Text>
    </SafeAreaView>
  );
}

