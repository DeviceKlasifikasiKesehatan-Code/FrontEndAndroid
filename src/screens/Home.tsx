import React, { useState, useEffect } from 'react';
import { SafeAreaView, Image, View, Text, Pressable, FlatList } from 'react-native';
import * as Location from 'expo-location';
import styles from "../styles/HomeStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen: React.FC = () => {
    const [location, setLocation] = useState<string>('Mengambil lokasi...');
    const [lastRecord, setLastRecord] = useState<string>('Tidak ada rekaman terakhir');

    const formatDuration = (ms: number) => {
        if (ms < 60000) {
            const seconds = Math.floor(ms / 1000);
            return `${seconds} detik rekaman`;
        } else {
            const minutes = Math.floor(ms / 60000);
            return `${minutes} menit rekaman`;
        }
    };

    // const fetchData = async () => {
    //     try {
    //       const token = await AsyncStorage.getItem('userToken');

    //       const response = await fetch('https://api.example.com/protected-route', {
    //         method: 'GET',
    //         headers: {
    //           'Authorization': `Bearer ${token}`,
    //         },
    //       });

    //       if (response.status === 401) {
    //         console.log('Token expired! Menghapus token dan kembali ke login.');
    //         await AsyncStorage.removeItem('userToken');
    //         setInitialRoute('Gerbang'); // Arahkan ke halaman login
    //       } else {
    //         const data = await response.json();
    //         console.log('Data:', data);
    //       }
    //     } catch (error) {
    //       console.error('Error saat fetch data:', error);
    //     }
    //   };


    const history = [
        { id_data: 1, tanggal: '2025-03-10', durasi: 10000 },
        { id_data: 2, tanggal: '2025-03-09', durasi: 90000 },
        { id_data: 3, tanggal: '2025-03-08', durasi: 30000 },
        { id_data: 1, tanggal: '2025-03-10', durasi: 10000 },
        { id_data: 2, tanggal: '2025-03-09', durasi: 90000 },
        { id_data: 3, tanggal: '2025-03-08', durasi: 30000 },
        { id_data: 1, tanggal: '2025-03-10', durasi: 10000 },
        { id_data: 2, tanggal: '2025-03-09', durasi: 90000 },
        { id_data: 3, tanggal: '2025-03-08', durasi: 30000 },
        { id_data: 1, tanggal: '2025-03-10', durasi: 10000 },
        { id_data: 2, tanggal: '2025-03-09', durasi: 90000 },
        { id_data: 3, tanggal: '2025-03-08', durasi: 30000 },
        { id_data: 1, tanggal: '2025-03-10', durasi: 10000 },
        { id_data: 2, tanggal: '2025-03-09', durasi: 90000 },
        { id_data: 3, tanggal: '2025-03-08', durasi: 30000 },
        { id_data: 1, tanggal: '2025-03-10', durasi: 10000 },
        { id_data: 2, tanggal: '2025-03-09', durasi: 90000 },
        { id_data: 3, tanggal: '2025-03-08', durasi: 30000 },
    ];


    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocation('Izin lokasi ditolak');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            const reverseGeo = await Location.reverseGeocodeAsync(currentLocation.coords);
            if (reverseGeo.length > 0) {
                setLocation(reverseGeo[0].city || 'Lokasi tidak ditemukan');
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => console.log('Menu ditekan')}>
                    <Text style={styles.menuButton}>☰</Text>
                </Pressable>
                <View style={styles.locationContainer}>
                    <Text style={styles.locationText}>Lokasi saat ini</Text>
                    <Text style={styles.locationText}>📍 {location}</Text>
                </View>
            </View>

            <View style={styles.lastRecord}>
                <View style={styles.lastRecordContainer}>
                    <Text style={styles.lastRecordTitle}>Data Rekaman Terakhir</Text>
                    <Pressable style={styles.lastRecordButton}>
                        <Text style={styles.buttonText}>Lihat Hasil</Text>
                    </Pressable>
                </View>

                <View style={styles.lastResultContainer}>
                    <View style={styles.resultTextContainer}>
                        <Image
                            style={styles.logoResult}
                            source={require('../../assets/icon-hati.png')}
                        />
                        <Text style={styles.resultText}>XX</Text>
                        <Text style={styles.resultSatuan}>Bpm</Text>
                    </View>

                    <View style={styles.resultTextContainer}>
                        <Image
                            style={styles.logoResult}
                            source={require('../../assets/icon-stopwatch.png')}
                        />
                        <Text style={styles.resultText}>XX</Text>
                        <Text style={styles.resultSatuan}>min</Text>
                    </View>

                    <View style={styles.resultTextContainer}>
                        <Text style={styles.resultText}>dd/mm</Text>
                        <Image
                            style={styles.logoResult}
                            source={require('../../assets/icon-callendar.png')}
                        />
                    </View>

                </View>
            </View>

            <View style={styles.history}>
                <Text style={styles.sectionTitle}>Riwayat Rekaman</Text>
                <FlatList
                    style={styles.historyList}
                    data={history}
                    keyExtractor={(item) => item.id_data.toString()} // Gunakan id_data sebagai key
                    renderItem={({ item }) => (
                        <View style={styles.historyItem}>
                            <View>
                                <Text style={styles.historyItemTanggal}>{item.tanggal}</Text>
                                <Text style={styles.historyItemDurasi}>{formatDuration(item.durasi)}</Text>
                            </View>
                            <Image
                                style={styles.logoResult}
                                source={require('../../assets/icon-data.png')}
                            />
                        </View>
                    )}
                />
            </View>

        </View>

    );
};

export default HomeScreen;
