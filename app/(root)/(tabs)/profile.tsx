import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import QRCode from 'react-native-qrcode-svg'; // Import QRCode library

const ProfileScreen = () => {
  const { user } = useUser();
  const [image, setImage] = useState(user?.imageUrl || "https://randomuser.me/api/portraits/men/1.jpg");
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
  const [phone, setPhone] = useState(user?.primaryPhoneNumber?.phoneNumber || "");

  useEffect(() => {
    if (user) {
      setImage(user.imageUrl);
      setFirstName(user.firstName);
      setEmail(user.primaryEmailAddress?.emailAddress);
      setPhone(user.primaryPhoneNumber?.phoneNumber);
    }
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Derive the username from the email (before the @ symbol)
  const username = firstName || email.split('@')[0];

  // User details to encode in QR code
  const userDetails = {
    username,
    email,
    phone,
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* QR Code Generation */}
      <View className="items-center mt-6 mb-8">
        <Text className="text-gray-700 mb-4">Scan this QR code to share your details:</Text>
        <QRCode
          value={JSON.stringify(userDetails)} // Encode user details in QR code
          size={250} // Adjust size for better visibility
          color="black" // Set color for the QR code
          backgroundColor="white" // Set background color to make it stand out
        />
      </View>

      {/* Profile Picture */}
      <View className="items-center mt-4">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image
            source={{ uri: image }}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <View className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            <FontAwesome name="camera" size={14} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      {/* User Information */}
      <View className="bg-white p-4 mt-6 rounded-lg shadow-md">
        <View className="mb-4">
          <Text className="text-gray-500 mb-1">Username</Text>
          <TextInput value={username} onChangeText={setFirstName} className="border p-2 rounded-lg bg-gray-100 text-gray-800" />
        </View>

        <View className="mb-4">
          <Text className="text-gray-500 mb-1">Email</Text>
          <TextInput value={email} onChangeText={setEmail} className="border p-2 rounded-lg bg-gray-100 text-gray-800" />
        </View>

        <View>
          <Text className="text-gray-500 mb-1">Phone number</Text>
          <TextInput value={phone} onChangeText={setPhone} className="border p-2 rounded-lg bg-gray-100 text-gray-800" />
        </View>
      </View>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 flex-row justify-around items-center shadow-md">
        <TouchableOpacity>
          <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="envelope" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="comment" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="user-circle" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
