import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  ScrollView
} from 'react-native'
import * as Location from 'expo-location'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import styles from '../styles/HomeStyles'
import { calculateHeartRate } from '../script/HRCalculate'
import utils from '../script/utils'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<string>('Mengambil lokasi...')
  const [history, setHistory] = useState<
    { id_data: number; tanggal: string; durasi: number }[]
  >([])
  const [nik, setNik] = useState<string | null>(null)
  const [bpm, setBpm] = useState<string>('XX')
  const [loading, setLoading] = useState<boolean>(true)
  const [bpmLoading, setBpmLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigation = useNavigation()

  const getDurationParts = (id_data: string) => {
    const parts = extractDurationFromId(id_data).split(' ')
    return {
      value: parts[0] || '0',
      unit: parts[1] || 'detik'
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem('userToken')
      try {
        if (!token) {
          navigation.replace('Gerbang')
          return
        }

        const authResponse = await fetch(`${utils.API_BASE_URL}/auth/cauth`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const authData = await authResponse.json()
        if (authResponse.status === 401) {
          await AsyncStorage.removeItem('userToken')
          navigation.replace('Gerbang')
          return
        }

        if (!authResponse.ok) {
          throw new Error(authData.message || 'Gagal mendapatkan NIK')
        }

        const fetchedNik = authData.user.nik
        setNik(fetchedNik)

        const historyResponse = await fetch(
          `${utils.API_BASE_URL}/data/gethist/${fetchedNik}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        const historyData = await historyResponse.json()
        if (!historyResponse.ok) {
          throw new Error(
            historyData.message || 'Gagal mendapatkan riwayat rekaman'
          )
        }

        const formattedHistory = historyData.history.map((item: any) => {
          const [year, month, day] = item.created_at_wib
            .split('T')[0]
            .split('-')
          return {
            id_data: item.id_data,
            tanggal: `${day}/${month}/${year.slice(2)}`,
            durasi: item.durasi || 0
          }
        })

        setHistory(formattedHistory)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    interval = setInterval(fetchUserData, 15000) // 15 detik

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocation('Izin lokasi ditolak')
        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({})
      const reverseGeo = await Location.reverseGeocodeAsync(
        currentLocation.coords
      )
      if (reverseGeo.length > 0) {
        setLocation(reverseGeo[0].city || 'Lokasi tidak ditemukan')
      }
    })()
  }, [])

  const extractDurationFromId = (id_data: string): string => {
    const match = id_data.match(/\|(\d+)_/)
    if (!match) return '0 detik'
    const duration = parseInt(match[1])
    return duration >= 60
      ? `${Math.floor(duration / 60)} menit`
      : `${duration} detik`
  }

  const fetchBPMData = async () => {
    if (!history.length) return

    const id_data = encodeURIComponent(history[0].id_data)
    setBpmLoading(true)

    try {
      const response = await fetch(
        `${utils.API_BASE_URL}/data/getData?id_data=${id_data}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendapatkan data BPM')
      }

      if (data.data.data && data.data.id_data) {
        const calculatedBpm = calculateHeartRate(data.data.data)
        const formattedBpm = parseFloat(calculatedBpm).toFixed(2)
        setBpm(formattedBpm)
      } else {
        console.warn('Data BPM tidak ditemukan dalam respons.')
        setBpmLoading(true)
      }
    } catch (err) {
      console.error('Error mengambil data BPM:', err)
      setBpm('Error!')
    } finally {
      setBpmLoading(false)
    }
  }

  useEffect(() => {
    fetchBPMData()
    const interval = setInterval(fetchBPMData, 60000) // 1 menit
    return () => clearInterval(interval)
  }, [history])

  if (loading) {
    return <ActivityIndicator size='large' color='#0000ff' />
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.navigate('Profil')}>
              <FontAwesome name='hospital-user' size={25} color={'#133E87'} />
            </Pressable>
            <View style={styles.locationContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                  <Text style={styles.locationText}>Lokasi saat ini</Text>
                  <Text style={styles.locationText}>📍 {location}</Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate('HospitalMap')}
                  style={{
                    marginLeft: 10,
                    borderWidth: 2,
                    borderColor: '#133E87',
                    borderRadius: 5,
                    padding: 5,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FontAwesome name='hospital' size={25} color={'#133E87'} />
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.lastRecord}>
            <View style={styles.lastRecordContainer}>
              <Text style={styles.lastRecordTitle}>Data Rekaman Terakhir</Text>
              <Pressable
                style={styles.lastRecordButton}
                onPress={() => {
                  if (history.length > 0) {
                    const lastIdData = history[0].id_data
                    const prevIdData = history[1]?.id_data
                    navigation.navigate('Data', {
                      id_data: lastIdData,
                      tanggal_record: history[0].tanggal,
                      durasi_record: extractDurationFromId(history[0].id_data),
                      prev_id_data: prevIdData
                    })
                  } else {
                    alert('Belum ada data rekaman!')
                  }
                }}
              >
                <Text style={styles.buttonText}>Lihat Hasil</Text>
              </Pressable>
            </View>

            <View style={styles.lastResultContainer}>
              <View style={styles.resultTextContainer}>
                <Image
                  style={styles.logoResult}
                  source={require('../../assets/icon-callendar.png')}
                />
                <Text style={styles.resultText}>
                  {history.length > 0 ? history[0].tanggal : 'dd/mm/yy'}
                </Text>
              </View>

              <View style={styles.resultTextContainer}>
                <Image
                  style={styles.logoResult}
                  source={require('../../assets/icon-hati.png')}
                />
                {bpmLoading ? (
                  <ActivityIndicator size='small' color='#000' />
                ) : (
                  <>
                    <Text style={styles.resultText}>{bpm}</Text>
                    <Text style={styles.resultSatuan}>Bpm</Text>
                  </>
                )}
              </View>

              <View style={styles.resultTextContainer}>
                <Image
                  style={styles.logoResult}
                  source={require('../../assets/icon-stopwatch.png')}
                />
                {history.length > 0 ? (
                  <>
                    <Text style={styles.resultText}>
                      {getDurationParts(history[0].id_data).value}
                    </Text>
                    <Text style={styles.resultSatuan}>
                      {getDurationParts(history[0].id_data).unit}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.resultText}>Belum</Text>
                    <Text style={styles.resultSatuan}>ada record</Text>
                  </>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={styles.sectionTitle}>Riwayat Rekaman</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {history.length === 0 ? (
              <Text style={{ color: '#888', marginTop: 10 }}>
                Belum ada data rekaman
              </Text>
            ) : (
              history.map((item, index) => {
                const prevItem = history[index + 1]
                const prevIdData = prevItem ? prevItem.id_data : null

                return (
                  <View
                    style={styles.historyItem}
                    key={item.id_data.toString()}
                  >
                    <View>
                      <Text style={styles.historyItemTanggal}>
                        {item.tanggal}
                      </Text>
                      <Text style={styles.historyItemDurasi}>
                        {extractDurationFromId(item.id_data)}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() =>
                        navigation.navigate('Data', {
                          id_data: item.id_data,
                          tanggal_record: item.tanggal,
                          durasi_record: extractDurationFromId(item.id_data),
                          prev_id_data: prevIdData
                        })
                      }
                    >
                      <Image
                        style={styles.logoResult}
                        source={require('../../assets/icon-data.png')}
                      />
                    </Pressable>
                  </View>
                )
              })
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
