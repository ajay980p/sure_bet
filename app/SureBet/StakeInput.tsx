import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';

interface StakeInputProps {
    value: string;
    onChangeText: (text: string) => void;
    error: string;
    clearError: () => void;
}

const StakeInput: React.FC<StakeInputProps> = ({ value, onChangeText, error, clearError }) => {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Stake</Text>
            <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
                <Feather name="briefcase" size={18} color="#888" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Enter Total Stake"
                    onFocus={clearError}
                />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

export default StakeInput;