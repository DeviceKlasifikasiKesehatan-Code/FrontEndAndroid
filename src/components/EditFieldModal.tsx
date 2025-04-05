import React from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import styles from "../styles/ProfilStyles";

interface Props {
    visible: boolean;
    label: string;
    value: string;
    onChange: (text: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

const EditFieldModal: React.FC<Props> = ({ visible, label, value, onChange, onSave, onCancel }) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit {label}</Text>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChange}
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                            <Text style={styles.saveText}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditFieldModal;
