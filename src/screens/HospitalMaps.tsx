import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Ganti dengan API Key-mu

const HospitalMap = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Izin lokasi ditolak");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchNearbyHospitals(loc.coords);
    })();
  }, []);

  const fetchNearbyHospitals = async coords => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${coords.latitude},${coords.longitude}`,
            radius: 5000, // dalam meter
            type: "hospital",
            key: GOOGLE_API_KEY
          }
        }
      );

      setHospitals(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal memuat rumah sakit");
    }
  };

  if (!location || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Memuat lokasi dan rumah sakit terdekat...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }}
    >
      <Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
        }}
        title="Lokasi Saya"
        pinColor="blue"
      />
      {hospitals.map((hospital, index) =>
        <Marker
          key={index}
          coordinate={{
            latitude: hospital.geometry.location.lat,
            longitude: hospital.geometry.location.lng
          }}
          title={hospital.name}
          description={hospital.vicinity}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default HospitalMap;
