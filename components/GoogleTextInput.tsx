import { View, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location"; // Import Expo Location
import { useEffect, useState } from "react";

import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}>
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor || "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor || "white",
            position: "absolute",
            top: 50,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 999,
            maxHeight: 300, // Ensures visibility of suggestions
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
          location: userLocation ? `${userLocation.lat},${userLocation.lng}` : undefined, // Set location
          radius: 5000, // 5km radius
          type: "establishment", // Suggest places like restaurants, cafes, etc.
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Image source={icon ? icon : icons.search} className="w-6 h-6" resizeMode="contain" />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
