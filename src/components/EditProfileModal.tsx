import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import styles from "../styles/ProfilStyles";

interface Props {
    visible: boolean;
    field: string;
    value: string;
    onChange: (text: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const EditProfileModal: React.FC<Props> = ({
    visible,
    field,
    value,
    onChange,
    onSave,
    onCancel
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit {field}</Text>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChange}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onSave} style={styles.saveButton}>
                            <Text style={styles.saveText}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditProfileModal;
