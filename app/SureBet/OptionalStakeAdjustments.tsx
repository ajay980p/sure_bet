import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './styles';

interface OptionalStakeAdjustmentsProps {
    stake1: string;
    stake2: string;
    handleStake1Change: (text: string) => void;
    handleStake2Change: (text: string) => void;
}

const OptionalStakeAdjustments: React.FC<OptionalStakeAdjustmentsProps> = ({ stake1, stake2, handleStake1Change, handleStake2Change }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.inputGroupLabel}>Optional Stake Adjustment</Text>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Stake 1 amount</Text>
                <View style={styles.inputRow}>
                    <Feather name="arrow-up-right" size={18} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={stake1}
                        onChangeText={handleStake1Change}
                        placeholder="Auto"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Stake 2 amount</Text>
                <View style={styles.inputRow}>
                    <Feather name="arrow-up-right" size={18} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={stake2}
                        onChangeText={handleStake2Change}
                        placeholder="Auto"
                    />
                </View>
            </View>
        </View>
    );
};

export default OptionalStakeAdjustments;