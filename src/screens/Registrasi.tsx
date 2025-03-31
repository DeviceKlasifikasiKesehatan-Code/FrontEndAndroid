import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, Platform, View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import styles from "../styles/RegisScreenStyles";
import { useNavigation } from '@react-navigation/native';

const RegistrasiScreen: React.FC = () => {
    const [fullName, setFullName] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");
    const [nik, setNik] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [deviceID, setDeviceID] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
    const navigation = useNavigation();

    const validateEmail = (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
            setEmailError("Format email tidak valid");
        } else {
            setEmailError("");
        }
        setEmail(input);
    };

    const validatePassword = (input: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(input)) {
            setPasswordError("Password harus memiliki minimal 8 karakter, 1 huruf besar, 1 angka, dan 1 karakter unik");
        } else {
            setPasswordError("");
        }
        setPassword(input);
    };

    const checkConfirmPassword = (input: string) => {
        setConfirmPassword(input);
        if (input !== password) {
            setConfirmPasswordError("Konfirmasi password tidak cocok");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleRegister = async () => {
        const missingFields = [];

        if (!fullName) missingFields.push("Nama Lengkap");
        if (!nickName) missingFields.push("Nama Panggilan");
        if (!nik) missingFields.push("NIK");
        if (!phone) missingFields.push("Nomor Telepon");
        if (!email) missingFields.push("Email");
        if (!deviceID) missingFields.push("ID Perangkat");
        if (!password) missingFields.push("Password");
        if (!confirmPassword) missingFields.push("Ulangi Password");

        if (missingFields.length > 0) {
            alert(`Harap isi bidang berikut:\n- ${missingFields.join("\n- ")}`);
            return;
        }

        if (password !== confirmPassword) {
            alert("Konfirmasi password tidak cocok!");
            return;
        }

        try {
            const response = await fetch('http://192.168.1.67:3124/geni/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    nama_lengkap: fullName,
                    nama_panggilan: nickName,
                    sandi: password,
                    nik,
                    id_device: deviceID,
                    nomor_telepon: phone,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                navigation.navigate('Gerbang');
            } else {
                alert(data.message || "Terjadi kesalahan saat registrasi.");
            }
        } catch (error) {
            console.error('Error saat registrasi:', error);
            alert('Terjadi kesalahan server');
        }
    };



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={styles.title}>Buat Akun Baru</Text>
                    <View style={styles.regisContainer}>

                        <TextInput
                            style={styles.input}
                            placeholder="Nama Lengkap"
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Nama Panggilan"
                            value={nickName}
                            onChangeText={setNickName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="NIK"
                            keyboardType="numeric"
                            value={nik}
                            onChangeText={setNik}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Nomor Telepon"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={validateEmail}
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                        <TextInput
                            style={styles.input}
                            placeholder="ID Perangkat"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={deviceID}
                            onChangeText={setDeviceID}
                        />

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={password}
                                onChangeText={validatePassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.showHideButton}
                            >
                                <Icon
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="#333"
                                />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Ulangi Password"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={confirmPassword}
                                onChangeText={checkConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.showHideButton}
                            >
                                <Icon
                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="#333"
                                />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                        <TouchableOpacity style={styles.regisButton} onPress={handleRegister}>
                            <Text style={styles.regisText}>Daftar</Text>
                        </TouchableOpacity>

                        <View style={styles.askRegis}>
                            <Text style={styles.askRegisText}>Sudah punya akun?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Gerbang')}>
                                <Text style={styles.underline}>Masuk</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegistrasiScreen;
