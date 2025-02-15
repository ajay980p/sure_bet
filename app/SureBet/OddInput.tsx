// components/OddInput.js (or OddInput.tsx)
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';

interface OddInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error: string;
    clearError: () => void;
}

const OddInput: React.FC<OddInputProps> = ({ label, value, onChangeText, error, clearError }) => {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
                <Feather name="aperture" size={18} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`e.g., ${label === 'Odd 1' ? '1.80' : '2.10'}`}
                    onFocus={clearError}
                />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

export default OddInput;