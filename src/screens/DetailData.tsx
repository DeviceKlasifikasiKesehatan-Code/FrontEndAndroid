import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Image
} from 'react-native'
import { Svg, Line, Polyline, Circle } from 'react-native-svg'
import { useRoute, useNavigation } from '@react-navigation/native'
import utils from '../script/utils'
import Icon from 'react-native-vector-icons/Feather'
import { calculateHeartRate } from '../script/HRCalculate'

const screenWidth = Dimensions.get('window').width
const chartWidth = screenWidth - 50
const chartHeight = 220
const itemsPerPage = 1000
const numberOfYLabels = 7
const numberOfXGrids = 5

const DetailData = () => {
  const route = useRoute()
  const { id_data, tanggal_record, durasi_record, prev_id_data } = route.params
  const [ekgData, setEkgData] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [bpm, setBpm] = useState<string>('XX')
  const [prevbpm, prevsetBpm] = useState<string>('XX')
  const [healthStat, setHealtStat] = useState<string>('')
  const [hrStat, setHRStat] = useState<string>('')
  const navigation = useNavigation()
  const [isDeleting, setIsDeleting] = useState(false)

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
      const raw = result.data.data || []
      const cleaned = raw.map(val => parseFloat(val)).filter(val => !isNaN(val))

      setEkgData(cleaned)

      const calculatedBpm = calculateHeartRate(cleaned)
      const formattedBpm = parseFloat(calculatedBpm).toFixed(2)

      if (calculatedBpm < 60 || calculatedBpm > 100) {
        setHealtStat('Tidak Normal')
      } else {
        setHealtStat('Normal')
      }

      setBpm(formattedBpm)

      if (prev_id_data) {
        const prev_response = await fetch(
          `${utils.API_BASE_URL}/data/getData?id_data=${encodeURIComponent(
            prev_id_data
          )}`
        )
        const prev_result = await prev_response.json()
        const prev_raw = prev_result.data.data || []
        const prev_cleaned = prev_raw
          .map(val => parseFloat(val))
          .filter(val => !isNaN(val))

        const prev_calculatedBpm = calculateHeartRate(prev_cleaned)
        const prev_formattedBpm = parseFloat(prev_calculatedBpm).toFixed(2)

        prevsetBpm(prev_formattedBpm)

        const diff = Math.abs(
          parseFloat(calculatedBpm) - parseFloat(prev_calculatedBpm)
        )

        if (diff > 40) {
          setHRStat('Tidak Normal')
        } else if (diff >= 30 && diff <= 40) {
          setHRStat('Perlu Waspada')
        } else {
          setHRStat('Normal')
        }
      } else {
        setHRStat(healthStat)
      }
    } catch (err) {
      setEkgData([])
    } finally {
      setLoading(false)
    }
  }

  const paginatedData = ekgData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const totalPages = Math.ceil(ekgData.length / itemsPerPage)

  const maxY = Math.max(...paginatedData)
  const minY = Math.min(...paginatedData)
  const rangeY = maxY - minY || 1
  const stepY = rangeY / (numberOfYLabels - 1)

  const xStep = chartWidth / (paginatedData.length - 1 || 1)
  const yScale = chartHeight / rangeY

  const points = paginatedData
    .map((value, index) => {
      const x = index * xStep
      const y = chartHeight - (value - minY) * yScale
      return `${x},${y}`
    })
    .join(' ')

  const gridX = Array.from(
    { length: Math.floor(paginatedData.length / 200) + 1 },
    (_, i) => i * 200
  )
  const gridY = Array.from({ length: numberOfYLabels }, (_, i) => i)

  const handleDeleteRecord = async () => {
    if (isDeleting) return

    const confirmed = await new Promise<boolean>(resolve => {
      return Alert.alert(
        'Konfirmasi Hapus',
        'Apakah Anda yakin ingin menghapus data ini?',
        [
          { text: 'Batal', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Hapus', onPress: () => resolve(true), style: 'destructive' }
        ],
        { cancelable: true }
      )
    })

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const response = await fetch(
        `${utils.API_BASE_URL}/data/del?id_data=${encodeURIComponent(id_data)}`,
        {
          method: 'DELETE'
        }
      )

      const result = await response.json()

      if (response.ok && result?.message === 'Data berhasil dihapus') {
        Alert.alert('Berhasil', 'Data berhasil dihapus')
        navigation.goBack()
      } else {
        Alert.alert('Gagal', result?.message || 'Gagal menghapus data')
      }
    } catch (error: any) {
      Alert.alert('Error', `Terjadi kesalahan saat menghapus: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: screenWidth * 0.13,
            alignItems: 'center',
            gap: 10
          }}
        >
          <View style={{ gap: 5, alignItems: 'center', width: '90%' }}>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name='arrow-left' size={28} color='#000000' />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontFamily: 'Montserrat' }}>
                Grafik Rekaman
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 20,
                width: '100%',
                borderBottomWidth: 1
              }}
            />
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}
            >
              <Text style={{ fontSize: 16, fontFamily: 'MontserratSemiBold' }}>
                {tanggal_record.length > 0 ? tanggal_record : 'dd/mm/yy'}
              </Text>
              <Text style={{ fontSize: 16, fontFamily: 'MontserratBlack' }}>
                |
              </Text>
              <Text style={{ fontSize: 16, fontFamily: 'MontserratSemiBold' }}>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#133E87',
                borderRadius: 10
              }}
            >
              <View
                style={{
                  justifyContent: 'space-between',
                  height: chartHeight,
                  marginRight: 5
                }}
              >
                {Array.from({ length: numberOfYLabels }, (_, i) => {
                  const value = maxY - i * stepY
                  return (
                    <Text
                      key={`y-label-${i}`}
                      style={{
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 'bold',
                        textAlign: 'right'
                      }}
                    >
                      {value.toFixed(1)}
                    </Text>
                  )
                })}
              </View>

              <Svg height={chartHeight} width={chartWidth}>
                {gridY.map(i => {
                  const y = (i * chartHeight) / (numberOfYLabels - 1)
                  return (
                    <Line
                      key={`gridy-${i}`}
                      x1={0}
                      x2={chartWidth}
                      y1={y}
                      y2={y}
                      stroke='#FFFFFF20'
                      strokeWidth='1'
                    />
                  )
                })}
                {gridX.map((xIndex, i) => {
                  const x = xIndex * xStep
                  return (
                    <Line
                      key={`gridx-${i}`}
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={chartHeight}
                      stroke='white'
                      strokeWidth='1'
                    />
                  )
                })}
                {gridX.map((xIndex, xi) => {
                  const x = xIndex * xStep
                  return gridY.map((_, yi) => {
                    const y = (yi * chartHeight) / (numberOfYLabels - 1)
                    return (
                      <Circle
                        key={`dot-${xi}-${yi}`}
                        cx={x}
                        cy={y}
                        r='1.5'
                        fill='#FFFFFF50'
                      />
                    )
                  })
                })}
                <Polyline
                  points={points}
                  fill='none'
                  stroke='#39FF14'
                  strokeWidth='2'
                />
              </Svg>
            </View>
          )}

          {ekgData.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: chartWidth
              }}
            >
              {gridX.map((_, i) => {
                const seconds = currentPage * gridX.length + i
                return (
                  <Text
                    key={i}
                    style={{
                      color: '#000000',
                      fontWeight: 'bold',
                      fontSize: 10
                    }}
                  >
                    {seconds}s
                  </Text>
                )
              })}
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              width: screenWidth - 40
            }}
          >
            <Pressable
              onPress={() => {
                if (currentPage > 0) {
                  setLoading(true)
                  setTimeout(() => {
                    setCurrentPage(prev => prev - 1)
                    setLoading(false)
                  }, 200)
                }
              }}
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
              onPress={() => {
                if (currentPage < totalPages - 1) {
                  setLoading(true)
                  setTimeout(() => {
                    setCurrentPage(prev => prev + 1)
                    setLoading(false)
                  }, 200)
                }
              }}
              disabled={currentPage >= totalPages - 1 || loading}
              style={{
                padding: 10,
                backgroundColor:
                  currentPage >= totalPages - 1 || loading ? '#ccc' : '#133E87',
                borderRadius: 300
              }}
            >
              <Icon name='arrow-right' size={28} color='#FFFFFF' />
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: '#3560A0',
              padding: 20,
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
              width: '100%',
              flex: 1,
              gap: 10
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

            {/* <View
            style={{
              alignSelf: 'center',
              paddingVertical: 5,
              paddingHorizontal: 15,
              backgroundColor: healthStat === 'Normal' ? 'green' : 'red',
              borderRadius: 10,
              marginTop: 10
            }}
          >
            
          </View> */}

            <Text
              style={{
                color: healthStat === 'Normal' ? 'green' : 'red',
                fontSize: 18,
                textAlign: 'center',
                fontFamily: 'MontserratBold'
              }}
            >
              {healthStat}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                width: '100%',
                paddingHorizontal: 20
              }}
            >
              <Image
                source={require('../../assets/jantung-merah.png')}
                style={{
                  height: 35,
                  marginRight: 0,
                  resizeMode: 'contain'
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  marginRight: 10,
                  color: 'white',
                  fontFamily: 'MontserratSemiBold'
                }}
              >
                HR
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  fontFamily: 'MontserratSemiBold'
                }}
              >
                {bpm}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'white',
                  fontFamily: 'MontserratSemiBold'
                }}
              >
                Bpm
              </Text>
            </View>

            {prev_id_data && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  width: '100%',
                  paddingHorizontal: 20
                }}
              >
                <Image
                  source={require('../../assets/jantung-merah.png')}
                  style={{
                    height: 35,
                    marginRight: 0,
                    resizeMode: 'contain'
                  }}
                />
                <Text
                  style={{
                    fontSize: 20,
                    marginRight: 10,
                    color: 'white',
                    fontFamily: 'MontserratSemiBold'
                  }}
                >
                  PrevHR
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    fontFamily: 'MontserratSemiBold'
                  }}
                >
                  {prevbpm}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    fontFamily: 'MontserratSemiBold'
                  }}
                >
                  Bpm
                </Text>
              </View>
            )}

            <View
              style={{
                alignSelf: 'center',
                borderRadius: 10,
                marginTop: 10
              }}
            >
              <Text
                style={{
                  color:
                    hrStat === 'Normal'
                      ? '#58FF6C'
                      : hrStat === 'Perlu Waspada'
                      ? 'orange'
                      : 'red',
                  fontSize: 16,
                  textAlign: 'center',
                  fontFamily: 'MontserratSemiBold'
                }}
              >
                Status Detak: {hrStat}
              </Text>
            </View>

            <Pressable
              onPress={handleDeleteRecord}
              disabled={isDeleting}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 25,
                backgroundColor:
                  currentPage >= totalPages - 1 || loading ? '#ccc' : 'red',
                borderRadius: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gapVertical: 20,
                alignSelf: 'center'
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  textAlign: 'center',
                  fontFamily: 'MontserratBold'
                }}
              >
                Hapus Record
              </Text>
              <Icon name='trash' size={22} color='#FFFFFF' />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default DetailData
