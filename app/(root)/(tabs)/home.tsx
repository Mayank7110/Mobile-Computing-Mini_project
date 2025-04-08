import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import { useFetch } from "@/lib/fetch";
import { useLocationStore } from "@/store";
import { Ride } from "@/types/type";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter(); 

  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const handleSignOut = async () => {
    try {
      await signOut(); // Signs the user out
      router.replace("/(auth)/sign-in"); // Redirect to sign-in page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const recentRides = [
    {
      ride_id: "1",
      origin_address: "Kathmandu, Nepal",
      destination_address: "Pokhara, Nepal",
      origin_latitude: "27.717245",
      origin_longitude: "85.323961",
      destination_latitude: "28.209583",
      destination_longitude: "83.985567",
      ride_time: 391,
      fare_price: "19500.00",
      payment_status: "paid",
      driver_id: 2,
      user_id: "1",
      created_at: "2024-08-12 05:19:20.620007",
      driver: {
        driver_id: "2",
        first_name: "David",
        last_name: "Brown",
        profile_image_url: "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image_url: "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        car_seats: 5,
        rating: "4.60"
      }
    },
    // More ride data...
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, []);

  return (
    <SafeAreaView className="bg-general-500">
      <FlatList
        data={recentRides?.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center">
            {!loading ? (
              <>
                <Image source={images.noResult} className="w-40 h-40" alt="No recent rides found" resizeMode="contain" />
                <Text className="text-sm">No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size="small" color="#000" />
            )}
          </View>
        )}
        ListHeaderComponent={
          <>
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-2xl font-JakartaExtraBold">Welcome {user?.firstName}👋</Text>
              <TouchableOpacity onPress={handleSignOut} className="justify-center items-center w-10 h-10 rounded-full bg-white">
                <Image source={icons.out} className="w-4 h-4" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              // handlePress={handleDestinationPress}
            />

            <Text className="text-xl font-JakartaBold mt-5 mb-3">Your current location</Text>
            <View className="flex flex-row items-center bg-transparent h-[300px]">
              <Map />
            </View>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">Recent Rides</Text>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default Home;
