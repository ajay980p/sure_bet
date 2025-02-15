import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { Result } from './SureBetCalculator';

interface ResultsCardProps {
    result: Result | null;
    totalStakeValue: string;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, totalStakeValue }) => {
    if (!result) {
        return null;
    }

    return (
        <View style={styles.card}>
            <Text style={styles.resultText}>Total Stake : <Text style={styles.resultValue}>{totalStakeValue}</Text></Text>
            <Text style={styles.resultText}>Total Payout : <Text style={styles.resultValue}>{(parseFloat(totalStakeValue) + parseFloat(result.profit.toFixed(2))).toFixed(2)}</Text></Text>
            <Text style={styles.resultText}>Total Profit : <Text style={styles.resultValue}>{result.profit.toFixed(2)}</Text></Text>

            <Text
                style={[
                    styles.profitText,
                    {
                        color: result.profit > 0 ? '#27ae60' : '#e74c3c',
                        fontWeight: 'bold',
                    },
                ]}
            >
                ROI (Return on Investment): <Text style={styles.resultValue}>{result.profitPercentage}%</Text>
            </Text>
        </View>
    );
};

export default ResultsCard;