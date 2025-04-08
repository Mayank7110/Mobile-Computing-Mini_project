import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const Map = ({ onSelectDestination }: { onSelectDestination: Function }) => {
  const [userLocation, setUserLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    const addressData = await Location.reverseGeocodeAsync({ latitude, longitude });
    const address = `${addressData[0]?.name}, ${addressData[0]?.region}`;

    setDestination({ latitude, longitude, address });

    onSelectDestination({ latitude, longitude, address });
  };

  useEffect(() => {
    if (userLocation && destination && mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(["currentLocation", "destination"], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  }, [userLocation, destination]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : undefined
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
            identifier="currentLocation"
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="red"
            identifier="destination"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Map;
