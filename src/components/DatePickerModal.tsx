import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

interface Props {
    visible: boolean;
    value: string;
    onChange: (event: any, selectedDate?: Date) => void;
}

const DatePickerModal: React.FC<Props> = ({ visible, value, onChange }) => {
    const date = value ? new Date(value) : new Date();

    if (!visible) return null;

    return (
        <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChange}
        />
    );
};

export default DatePickerModal;
