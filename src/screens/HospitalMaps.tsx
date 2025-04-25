import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import axios from 'axios'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import HospitalMapsStyle from '../styles/HospitalMapsStyle'

const GEOAPIFY_API_KEY = 'dfc3326b862a440bb56cd5aeefc8cbf2'

const HospitalMap = ({ navigation }) => {
  const [location, setLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [medicalCenters, setMedicalCenters] = useState([])
  const [pharmacies, setPharmacies] = useState([])
  const [loading, setLoading] = useState(true)
  const [mapRegion, setMapRegion] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Izin lokasi ditolak')
        return
      }

      const loc = await Location.getCurrentPositionAsync({})
      setLocation(loc.coords)
      setMapRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002
      })
      fetchNearbyFacilities(loc.coords)
    })()
  }, [])

  const fetchNearbyFacilities = async coords => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v2/places?categories=healthcare.hospital,healthcare.pharmacy&filter=circle:${coords.longitude},${coords.latitude},5000&apiKey=${GEOAPIFY_API_KEY}`
      )

      const hospitalsData = response.data.features.filter(facility =>
        facility.properties.categories.includes('healthcare.hospital')
      )
      const medicalCentersData = response.data.features.filter(facility =>
        facility.properties.categories.includes('healthcare.public_healthcare')
      )
      const pharmaciesData = response.data.features.filter(facility =>
        facility.properties.categories.includes('healthcare.pharmacy')
      )

      setHospitals(hospitalsData)
      setMedicalCenters(medicalCentersData)
      setPharmacies(pharmaciesData)

      setLoading(false)
    } catch (error) {
      console.error(error)
      Alert.alert('Gagal memuat fasilitas kesehatan')
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  const focusUserLocation = () => {
    if (location) {
      setMapRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002
      })
    }
  }

  const handleMarkerPress = facility => {
    setSelectedMarker(facility.properties.place_id)

    const fullAddress = `${facility.properties.address_line1}, ${
      facility.properties.address_line2 || ''
    }`

    setMapRegion({
      latitude: facility.geometry.coordinates[1],
      longitude: facility.geometry.coordinates[0],
      latitudeDelta: 0.002,
      longitudeDelta: 0.002
    })
  }

  const getIconSize = id => {
    return selectedMarker === id ? 35 : 25
  }

  const getIconColor = id => {
    return selectedMarker === id ? '#133E87' : 'red'
  }

  if (!location || loading) {
    return (
      <View style={HospitalMapsStyle.loadingContainer}>
        <ActivityIndicator size='large' color='#000' />
        <Text>Memuat lokasi dan fasilitas kesehatan terdekat...</Text>
      </View>
    )
  }

  return (
    <View style={HospitalMapsStyle.container}>
      <View style={HospitalMapsStyle.header}>
        <TouchableOpacity style={HospitalMapsStyle.backButton} onPress={goBack}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>

        <Text style={HospitalMapsStyle.title}>
          Fasilitas Kesehatan Terdekat
        </Text>

        <TouchableOpacity
          style={HospitalMapsStyle.focusButton}
          onPress={focusUserLocation}
        >
          <Ionicons name='locate' size={24} color='black' />
        </TouchableOpacity>
      </View>

      <MapView
        style={HospitalMapsStyle.map}
        region={mapRegion}
        onRegionChangeComplete={region => setMapRegion(region)}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
          title='Lokasi Saya'
          description='Ini adalah lokasi Anda'
          pinColor='blue'
        />

        {hospitals.map((hospital, index) => {
          const fullAddress = `${hospital.properties.address_line1}, ${
            hospital.properties.address_line2 || ''
          }`
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.geometry.coordinates[1],
                longitude: hospital.geometry.coordinates[0]
              }}
              title={hospital.properties.name}
              description={fullAddress}
              onPress={() => handleMarkerPress(hospital)}
            >
              <FontAwesome
                name='hand-holding-medical'
                size={getIconSize(`hospital-${index}`)}
                color={getIconColor(`hospital-${index}`)}
              />
            </Marker>
          )
        })}

        {medicalCenters.map((medicalCenter, index) => {
          const fullAddress = `${medicalCenter.properties.address_line1}, ${
            medicalCenter.properties.address_line2 || ''
          }`
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: medicalCenter.geometry.coordinates[1],
                longitude: medicalCenter.geometry.coordinates[0]
              }}
              title={medicalCenter.properties.name}
              description={fullAddress}
              onPress={() => handleMarkerPress(medicalCenter)}
            >
              <FontAwesome
                name='briefcase-medical'
                size={getIconSize(`medicalCenter-${index}`)}
                color={getIconColor(`medicalCenter-${index}`)}
              />
            </Marker>
          )
        })}

        {pharmacies.map((pharmacy, index) => {
          const fullAddress = `${pharmacy.properties.address_line1}, ${
            pharmacy.properties.address_line2 || ''
          }`
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: pharmacy.geometry.coordinates[1],
                longitude: pharmacy.geometry.coordinates[0]
              }}
              title={pharmacy.properties.name}
              description={fullAddress}
              onPress={() => handleMarkerPress(pharmacy)}
            >
              <FontAwesome
                name='briefcase-medical'
                size={getIconSize(`pharmacy-${index}`)}
                color={getIconColor(`pharmacy-${index}`)}
              />
            </Marker>
          )
        })}
      </MapView>
    </View>
  )
}

export default HospitalMap
