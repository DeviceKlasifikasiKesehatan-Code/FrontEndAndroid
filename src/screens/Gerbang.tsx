import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, Image, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import styles from "../styles/GerbangScreenStyles";
import { useNavigation } from '@react-navigation/native';

const GerbangScreen: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

    const handleLogin = async () => {
        setErrorMessage(null); // Reset pesan error saat mulai login
        setEmailError('');
        setPasswordError('');

        if (!email || !password) {
            if (!email) setEmailError('Email wajib diisi');
            if (!password) setPasswordError('Password wajib diisi');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.67:3124/geni/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, sandi: password }),
            });

            const data = await response.json();

            if (response.ok) {
                ToastAndroid.show(data.message, ToastAndroid.SHORT);
                console.log('Login berhasil');
                navigation.navigate('Home');
            } else {
                if (data.message.includes("Email")) {
                    setEmailError(data.message);
                } else if (data.message.includes("Password")) {
                    setPasswordError(data.message);
                } else {
                    setErrorMessage(data.message || 'Login gagal');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Terjadi kesalahan saat login');
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
                    <View style={styles.loginContainer}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/icon-light.png')}
                        />
                        <Text style={styles.title}>Masuk Aplikasi</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={validateEmail}
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
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

                        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.loginText}>Masuk</Text>
                        </TouchableOpacity>

                        <View style={styles.askRegis}>
                            <Text style={styles.askRegisText}>Belum memiliki akun ?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Registrasi')}>
                                <Text style={styles.underline}>Daftar Akun</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View >
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default GerbangScreen;
