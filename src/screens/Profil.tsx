import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ProfilStyles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import utils from "../script/utils";

const ProfilScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          console.error("Token tidak ditemukan");
          return;
        }

        const response = await fetch(`${utils.API_BASE_URL}/auth/cauth`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
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
        routes: [{ name: "Gerbang" }]
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

  const handleSaveName = () => {
    // Update nama pengguna (bisa ditambahkan fungsi untuk update ke backend)
    userData.nama_pengguna = editedName;
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Kontainer Atas */}
      <View style={styles.topContainer}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Pengguna</Text>
        </View>

        <Image
          source={require("../../assets/user.png")}
          style={styles.profileImage}
        />

        <View style={styles.nameContainer}>
          <Text style={styles.userName}>
            {userData.nama_pengguna}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="edit-3" size={20} color="#007BFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Kontainer Bawah */}
      <View style={styles.bottomContainer}>
        <Text style={styles.label}>
          Nama Panggilan:{" "}
          <Text style={styles.value}>{userData.nama_panggilan}</Text>
        </Text>
        <Text style={styles.label}>
          Alamat: <Text style={styles.value}>{userData.alamat}</Text>
        </Text>
        <Text style={styles.label}>
          Nomor Telepon: <Text style={styles.value}>{userData.nomor_telp}</Text>
        </Text>
        <Text style={styles.label}>
          NIK: <Text style={styles.value}>{userData.nik}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{userData.email}</Text>
        </Text>
        <Text style={styles.label}>
          Tanggal Lahir:{" "}
          <Text style={styles.value}>{userData.tanggal_lahir}</Text>
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Edit Nama */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Nama</Text>
            <TextInput
              style={styles.input}
              value={editedName}
              onChangeText={setEditedName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveName}
                style={styles.saveButton}
              >
                <Text style={styles.saveText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfilScreen;
