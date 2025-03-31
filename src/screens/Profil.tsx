import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ProfilStyles";
import { useNavigation } from "@react-navigation/native";

const ProfilScreen: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                if (!token) {
                    console.error("Token tidak ditemukan");
                    return;
                }

                const response = await fetch("http://192.168.1.67:3124/geni/auth/cauth", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setUserData(data.user);
                } else {
                    console.error("Gagal mengambil data:", data.message);
                }
            } catch (error) {
                console.error("Error mengambil data pengguna:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            console.log("Berhasil logout");
            navigation.reset({
                index: 0,
                routes: [{ name: "Gerbang" }],
            });
        } catch (error) {
            console.error("Gagal logout:", error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!userData) {
        return <Text style={styles.errorText}>Data pengguna tidak tersedia</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil Pengguna</Text>
            <Text style={styles.label}>Nama: <Text style={styles.value}>{userData.nama_pengguna}</Text></Text>
            <Text style={styles.label}>Nama Panggilan: <Text style={styles.value}>{userData.nama_panggilan}</Text></Text>
            <Text style={styles.label}>Alamat: <Text style={styles.value}>{userData.alamat}</Text></Text>
            <Text style={styles.label}>Nomor Telepon: <Text style={styles.value}>{userData.nomor_telp}</Text></Text>
            <Text style={styles.label}>NIK: <Text style={styles.value}>{userData.nik}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{userData.email}</Text></Text>
            <Text style={styles.label}>Tanggal Lahir: <Text style={styles.value}>{userData.tanggal_lahir}</Text></Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfilScreen;
