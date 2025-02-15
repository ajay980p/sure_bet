// components/CalculationButtons.js (or CalculationButtons.tsx)
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';

interface CalculationButtonsProps {
    onCalculate: () => void;
    onReset: () => void;
    disableCalculate: boolean;
}

const CalculationButtons: React.FC<CalculationButtonsProps> = ({ onCalculate, onReset, disableCalculate }) => {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.calculateButton}
                onPress={onCalculate}
                disabled={disableCalculate}
            >
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
                <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CalculationButtons;