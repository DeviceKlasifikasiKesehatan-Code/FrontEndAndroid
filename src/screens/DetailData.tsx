import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator
} from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import { useRoute } from '@react-navigation/native'
import utils from '../script/utils'
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { calculateHeartRate } from '../script/HRCalculate'
import { captureRef } from 'react-native-view-shot'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNFS from 'react-native-fs'

const screenWidth = Dimensions.get('window').width

const DetailData = () => {
  const route = useRoute()
  const { id_data, tanggal_record, durasi_record } = route.params
  const [ekgData, setekgData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [bpm, setBpm] = useState<string>('XX')
  const [bpmLoading, setBpmLoading] = useState<boolean>(true)
  const itemsPerPage = 1000
  const navigation = useNavigation()

  useEffect(() => {
    fetchDataFromApi()
  }, [])

  const fetchDataFromApi = async () => {
    try {
      const response = await fetch(
        `${utils.API_BASE_URL}/data/getData?id_data=${encodeURIComponent(
          id_data
        )}`
      )
      const result = await response.json()

      const raw = result.data?.data || []

      if (!Array.isArray(raw) || raw.length === 0) {
        console.warn('Data tidak tersedia atau format salah:', raw)
        setekgData([])
        return
      }
      console.log('Data: ', result)

      if (data.data.data && data.data.id_data) {
        const calculatedBpm = calculateHeartRate(data.data.data)
        const formattedBpm = parseFloat(calculatedBpm).toFixed(2)
        setBpm(formattedBpm)
      } else {
        console.warn('Data BPM tidak ditemukan dalam respons.')
        setBpmLoading(true)
      }

      const cleaned = raw.map(val => parseFloat(val)).filter(val => !isNaN(val))
      setekgData(cleaned)
    } catch (err) {
      console.error('Error saat fetch data:', err)
      setekgData([])
    } finally {
      setLoading(false)
    }
  }

  const paginatedData = ekgData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const chartLabels = paginatedData.map((_, i) =>
    i % 50 === 0 ? `${i + currentPage * itemsPerPage}` : ''
  )

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: paginatedData,
        color: () => '#39FF14',
        strokeWidth: 3
      }
    ]
  }

  const chartConfig = {
    backgroundGradientFrom: '#133E87',
    backgroundGradientTo: '#133E87',
    decimalPlaces: 0,
    color: () => '#FFFFFF',
    labelColor: () => '#FFFFFF',
    propsForDots: {
      r: '0'
    }
  }

  const totalPages = Math.ceil(ekgData.length / itemsPerPage)

  const fetchBPMData = async () => {
    if (!history.length) return

    const id_data = encodeURIComponent(ekgData)
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

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => prev - 1)
        setLoading(false)
      }, 200) // waktu pendek untuk simulasikan loading
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setLoading(true)
      setTimeout(() => {
        setCurrentPage(prev => prev + 1)
        setLoading(false)
      }, 200)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: screenWidth * 0.13,
          alignItems: 'center',
          gap: 10
        }}
      >
        <View
          style={{
            gap: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              padding: 0
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-left' size={28} color='#000000' />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 24,
                textAlign: 'center',
                fontFamily: 'Montserrat'
              }}
            >
              Grafik Rekaman
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              width: '100%',
              borderBottomWidth: 1,
              padding: 0
            }}
          ></View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'MontserratSemiBold'
              }}
            >
              {tanggal_record.length > 0 ? tanggal_record : 'dd/mm/yy'}
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'MontserratBlack'
              }}
            >
              |
            </Text>
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'MontserratSemiBold'
              }}
            >
              {durasi_record}
            </Text>
          </View>
        </View>

        {ekgData.length === 0 ? (
          <View>
            <ActivityIndicator size='large' color='#133E87' />
            <Text>Memuat Data Rekaman</Text>
          </View>
        ) : (
          <>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              withInnerLines={false}
              withOuterLines={false}
              fromZero={true}
              style={{
                borderRadius: 15,
                marginRight: 0,
                paddingRight: 0,

                shadowColor: '#000',
                shadowOffset: { width: 10, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                width: screenWidth - 40
              }}
            >
              <Pressable
                onPress={handlePrevPage}
                disabled={currentPage === 0 || loading}
                style={{
                  padding: 10,
                  backgroundColor:
                    currentPage === 0 || loading ? '#ccc' : '#133E87',
                  borderRadius: 300
                }}
              >
                <Icon name='arrow-left' size={28} color='#FFFFFF' />
              </Pressable>

              {loading ? (
                <ActivityIndicator size='small' color='#133E87' />
              ) : (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: 'MontserratSemiBold'
                  }}
                >
                  Grafik {currentPage + 1} dari {totalPages}
                </Text>
              )}

              <Pressable
                onPress={handleNextPage}
                disabled={currentPage >= totalPages - 1 || loading}
                style={{
                  padding: 10,
                  backgroundColor:
                    currentPage >= totalPages - 1 || loading
                      ? '#ccc'
                      : '#133E87',
                  borderRadius: 300
                }}
              >
                <Icon name='arrow-right' size={28} color='#FFFFFF' />
              </Pressable>
            </View>
          </>
        )}

        <View
          style={{
            backgroundColor: '#3560A0',
            padding: 20,
            borderTopLeftRadius: 100,
            borderTopRightRadius: 100,
            width: '100%',
            flex: 1,
            alignSelf: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 24,
              alignSelf: 'center',
              color: 'white',
              fontFamily: 'MontserratSemiBold'
            }}
          >
            Report Hasil
          </Text>
          <View
            style={{
              fontSize: 24,
              alignSelf: 'center',
              color: 'white',
              fontFamily: 'MontserratSemiBold'
            }}
          >
            Status
          </View>
          <Text>{bpm} bpm</Text>
          <View></View>
          <View></View>
          <View></View>
          <View></View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default DetailData
