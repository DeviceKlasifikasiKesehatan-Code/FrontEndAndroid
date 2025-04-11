import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/ProfilStyles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import utils from "../script/utils";
import DatePickerModal from "../components/DatePickerModal";

const ProfilScreen: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

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
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.reset({ index: 0, routes: [{ name: "Gerbang" }] });
  };

  const openEditModal = (key: string, value: string) => {
    if (key === "tanggal_lahir") {
      setDatePickerVisible(true);
    } else {
      setEditingKey(key);
      setEditingValue(value);
      setModalVisible(true);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (!userData) return <Text>Data tidak tersedia</Text>;

  const updateUserData = async (fieldKey: string, newValue: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Token tidak ditemukan");

      const endpointMap: { [key: string]: string } = {
        nama_pengguna: "/auth/update/nama-lengkap",
        nama_panggilan: "/auth/update/nama-panggilan",
        alamat: "/auth/update/alamat",
        nomor_telp: "/auth/update/nomor-telepon",
        nik: "/auth/update/nik",
        tanggal_lahir: "/auth/update/tanggal-lahir"
      };

      const endpoint = endpointMap[fieldKey];
      if (!endpoint)
        throw new Error("Endpoint tidak ditemukan untuk field ini");

      const response = await fetch(`${utils.API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: userData.email,
          [fieldKey]: newValue
        })
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setUserData((prev: any) => ({ ...prev, [fieldKey]: newValue }));
      } else {
        throw new Error(result.message || "Server error");
      }
    } catch (error) {
      console.log("Ada error!", error);
      console.log("Ada error! Pesan error: ", error.message);
      console.error("Update error:", error);
      alert("Gagal update: " + error.message);
    }
  };

  const saveEdit = async () => {
    if (!editingKey) return;

    const valueToSend =
      editingValue === null || editingValue === "" ? "-" : editingValue;

    await updateUserData(editingKey, valueToSend);

    setModalVisible(false);
  };

  const handleDateChange = async (event: any, selectedDate?: Date) => {
    setDatePickerVisible(false);

    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      await updateUserData("tanggal_lahir", formatted);
    }
  };

  const formatTanggal = (isoDate: string): string => {
    if (!isoDate) return "-";
    return new Date(isoDate).toISOString().split("T")[0]; // yyyy-mm-dd
  };

  const getAge = (isoDate: string): number => {
    const birthDate = new Date(isoDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.backContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={28} color="#fff" />
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
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  openEditModal("nama_pengguna", userData.nama_pengguna)}
              >
                <Icon name="edit-3" size={20} color="#0D99FF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            {[
              { label: "Nama Panggilan", key: "nama_panggilan" },
              { label: "Alamat", key: "alamat" },
              { label: "Nomor Telepon", key: "nomor_telp" },
              { label: "NIK", key: "nik" },
              { label: "Email", key: "email" },
              { label: "Tanggal Lahir", key: "tanggal_lahir" }
            ].map(item =>
              <View key={item.key} style={styles.textContainer}>
                <Text style={styles.label}>
                  {item.label}:{" "}
                  <Text style={styles.value}>
                    {item.key === "tanggal_lahir"
                      ? formatTanggal(userData[item.key])
                      : userData[item.key]}
                  </Text>
                </Text>
                {item.key !== "email" &&
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => openEditModal(item.key, userData[item.key])}
                  >
                    <Icon name="edit-3" size={18} color="#0D99FF" />
                  </TouchableOpacity>}
              </View>
            )}

            <View style={styles.textContainer}>
              <Text style={styles.label}>
                Usia:{" "}
                <Text style={styles.value}>
                  {getAge(userData.tanggal_lahir)} tahun
                </Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Edit {editingKey}
                </Text>
                <TextInput
                  style={styles.input}
                  value={editingValue}
                  onChangeText={setEditingValue}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={saveEdit}
                    style={styles.saveButton}
                  >
                    <Text style={styles.saveText}>Simpan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Batal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Modal Date Picker */}
          <DatePickerModal
            visible={datePickerVisible}
            value={userData.tanggal_lahir}
            onChange={handleDateChange}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProfilScreen;
