import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

interface Result {
    stake1: number;
    stake2: number;
    profit: number;
    profitPercentage: number;
}

const SureBetCalculator: React.FC = () => {
    const [odd1, setOdd1] = useState<string>(''); // First odd
    const [odd2, setOdd2] = useState<string>(''); // Second odd
    const [stake1, setStake1] = useState<string>(''); // First stake
    const [stake2, setStake2] = useState<string>(''); // Second stake
    const [totalStake, setTotalStake] = useState<string>(''); // Total stake amount
    const [result, setResult] = useState<Result | null>(null); // Result state

    // Function to calculate Stake 1 and Stake 2 based on odds and total stake
    const calculateStakeValues = () => {
        const odd1Parsed = parseFloat(odd1);
        const odd2Parsed = parseFloat(odd2);
        const totalStakeParsed = parseFloat(totalStake);

        if (
            isNaN(odd1Parsed) ||
            isNaN(odd2Parsed) ||
            isNaN(totalStakeParsed) ||
            odd1Parsed <= 0 ||
            odd2Parsed <= 0 ||
            totalStakeParsed <= 0
        ) {
            alert('Please enter valid positive numbers.');
            return;
        }

        // Calculate stake1 and stake2 based on the sure bet formula
        const stake1Calculated =
            (1 / odd1Parsed) /
            ((1 / odd1Parsed) + (1 / odd2Parsed)) *
            totalStakeParsed;
        const stake2Calculated =
            (1 / odd2Parsed) /
            ((1 / odd1Parsed) + (1 / odd2Parsed)) *
            totalStakeParsed;

        // Calculate profit (assuming you win one of the bets)
        const profit = totalStakeParsed - (stake1Calculated + stake2Calculated);

        // Calculate profit percentage
        const profitPercentage = (profit / totalStakeParsed) * 100;

        setResult({
            stake1: stake1Calculated,
            stake2: stake2Calculated,
            profit,
            profitPercentage,
        });

        setStake1(stake1Calculated.toFixed(2));
        setStake2(stake2Calculated.toFixed(2));
    };

    // Handle manual change for Stake 1
    const handleStake1Change = (value: string) => {
        const newStake1 = parseFloat(value);
        if (!isNaN(newStake1) && newStake1 >= 0) {
            const odd1Parsed = parseFloat(odd1);
            const odd2Parsed = parseFloat(odd2);
            const totalStakeParsed = parseFloat(totalStake);

            // Calculate Stake 2 based on the updated Stake 1
            const stake2Calculated =
                ((1 / odd2Parsed) * totalStakeParsed -
                    newStake1 *
                    (1 / odd1Parsed)) /
                ((1 / odd1Parsed) + (1 / odd2Parsed));

            // Set the state values and recalculate result
            setStake1(value);
            setStake2(stake2Calculated.toFixed(2));
            setResult({
                stake1: newStake1,
                stake2: stake2Calculated,
                profit: totalStakeParsed - (newStake1 + stake2Calculated),
                profitPercentage: ((totalStakeParsed - (newStake1 + stake2Calculated)) / totalStakeParsed) * 100,
            });
        }
    };

    // Handle manual change for Stake 2
    const handleStake2Change = (value: string) => {
        const newStake2 = parseFloat(value);
        if (!isNaN(newStake2) && newStake2 >= 0) {
            const odd1Parsed = parseFloat(odd1);
            const odd2Parsed = parseFloat(odd2);
            const totalStakeParsed = parseFloat(totalStake);

            // Calculate Stake 1 based on the updated Stake 2
            const stake1Calculated =
                ((1 / odd1Parsed) * totalStakeParsed -
                    newStake2 *
                    (1 / odd2Parsed)) /
                ((1 / odd1Parsed) + (1 / odd2Parsed));

            // Set the state values and recalculate result
            setStake2(value);
            setStake1(stake1Calculated.toFixed(2));
            setResult({
                stake1: stake1Calculated,
                stake2: newStake2,
                profit: totalStakeParsed - (stake1Calculated + newStake2),
                profitPercentage: ((totalStakeParsed - (stake1Calculated + newStake2)) / totalStakeParsed) * 100,
            });
        }
    };

    // Handle manual changes to the total stake
    const handleTotalStakeChange = (value: string) => {
        const newTotalStake = parseFloat(value);
        if (!isNaN(newTotalStake) && newTotalStake > 0) {
            setTotalStake(value);
            calculateStakeValues(); // Recalculate stake values when total stake changes
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sure Bet Calculator</Text>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={odd1}
                    onChangeText={setOdd1}
                    placeholder="Odd 1"
                />
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stake1}
                    onChangeText={handleStake1Change} // Update Stake 1 manually
                    placeholder="Stake 1"
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={odd2}
                    onChangeText={setOdd2}
                    placeholder="Odd 2"
                />
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={stake2}
                    onChangeText={handleStake2Change} // Update Stake 2 manually
                    placeholder="Stake 2"
                />
            </View>

            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={totalStake}
                onChangeText={handleTotalStakeChange} // Update total stake manually
                placeholder="Total Stake"
            />

            <TouchableOpacity style={styles.calculateButton} onPress={calculateStakeValues}>
                <Text style={styles.buttonText}>Calculate</Text>
            </TouchableOpacity>

            {result && (
                <View style={styles.results}>
                    <Text style={styles.resultText}>Stake for Option 1: {result.stake1.toFixed(2)}</Text>
                    <Text style={styles.resultText}>Stake for Option 2: {result.stake2.toFixed(2)}</Text>
                    <Text style={styles.resultText}>Profit: {result.profit.toFixed(2)}</Text>
                    <Text style={styles.resultText}>Total Stake: {totalStake}</Text>

                    {/* Profit Percentage with color changes based on value */}
                    <Text
                        style={[
                            styles.profitText,
                            {
                                color: result.profit > 0 ? 'green' : 'red',
                                fontWeight: 'bold',
                            },
                        ]}
                    >
                        Profit Percentage: {result.profitPercentage}%
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f7f8fc',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#4e5b6e',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: '#3498db',
        borderWidth: 1.5,
        width: '45%',
        paddingLeft: 15,
        fontSize: 18,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    calculateButton: {
        backgroundColor: '#3498db',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    results: {
        marginTop: 25,
        backgroundColor: '#ecf0f1',
        padding: 15,
        borderRadius: 10,
    },
    resultText: {
        fontSize: 18,
        marginVertical: 5,
        color: '#4e5b6e',
    },
    profitText: {
        fontSize: 18,
        marginVertical: 10,
    },
});

export default SureBetCalculator;
