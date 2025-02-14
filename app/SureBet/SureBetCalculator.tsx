import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Result {
    stake1: number;
    stake2: number;
    profit: number;
    profitPercentage: number;
}

const SureBetCalculator: React.FC = () => {
    const [odd1, setOdd1] = useState<string>('');
    const [odd2, setOdd2] = useState<string>('');
    const [stake1, setStake1] = useState<string>('');
    const [stake2, setStake2] = useState<string>('');
    const [totalStake, setTotalStake] = useState<string>('');
    const [result, setResult] = useState<Result | null>(null);
    const [errorMessages, setErrorMessages] = useState({
        odd1Error: '',
        odd2Error: '',
        totalStakeError: '',
    });

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
            setErrorMessages({
                odd1Error: isNaN(odd1Parsed) || odd1Parsed <= 0 ? 'Invalid Odd 1' : '',
                odd2Error: isNaN(odd2Parsed) || odd2Parsed <= 0 ? 'Invalid Odd 2' : '',
                totalStakeError: isNaN(totalStakeParsed) || totalStakeParsed <= 0 ? 'Invalid Total Stake' : '',
            });
            alert('Please enter valid positive numbers.');
            return;
        }

        const stake1Calculated =
            (1 / odd1Parsed) /
            ((1 / odd1Parsed) + (1 / odd2Parsed)) *
            totalStakeParsed;
        const stake2Calculated =
            (1 / odd2Parsed) /
            ((1 / odd1Parsed) + (1 / odd2Parsed)) *
            totalStakeParsed;

        const arbitragePercentage =
            ((1 / odd1Parsed) + (1 / odd2Parsed) - 1) * 100;
        const roundedProfitPercentage = arbitragePercentage.toFixed(2);
        const profit = totalStakeParsed - (stake1Calculated + stake2Calculated);

        setResult({
            stake1: stake1Calculated,
            stake2: stake2Calculated,
            profit,
            profitPercentage: parseFloat(roundedProfitPercentage),
        });

        setStake1(stake1Calculated.toFixed(2));
        setStake2(stake2Calculated.toFixed(2));
    };

    const handleStake1Change = (value: string) => {
        const newStake1 = parseFloat(value);
        if (!isNaN(newStake1) && newStake1 >= 0) {
            const odd1Parsed = parseFloat(odd1);
            const odd2Parsed = parseFloat(odd2);
            const totalStakeParsed = parseFloat(totalStake);

            const stake2Calculated =
                ((1 / odd2Parsed) * totalStakeParsed - newStake1 * (1 / odd1Parsed)) /
                ((1 / odd1Parsed) + (1 / odd2Parsed));

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

    const handleStake2Change = (value: string) => {
        const newStake2 = parseFloat(value);
        if (!isNaN(newStake2) && newStake2 >= 0) {
            const odd1Parsed = parseFloat(odd1);
            const odd2Parsed = parseFloat(odd2);
            const totalStakeParsed = parseFloat(totalStake);

            const stake1Calculated =
                ((1 / odd1Parsed) * totalStakeParsed - newStake2 * (1 / odd2Parsed)) /
                ((1 / odd1Parsed) + (1 / odd2Parsed));

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

    const handleTotalStakeChange = (value: string) => {
        const newTotalStake = parseFloat(value);
        if (!isNaN(newTotalStake) && newTotalStake > 0) {
            setTotalStake(value);
            calculateStakeValues();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sure Bet Calculator</Text>

            <View style={styles.card}>
                <Text style={styles.inputGroupLabel}>Bet Option 1</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Odd 1</Text>
                    <View style={[styles.inputRow, errorMessages.odd1Error ? styles.inputRowError : null]}>
                        <Feather name="aperture" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={odd1}
                            onChangeText={setOdd1}
                            placeholder="e.g., 1.80"
                            onFocus={() => setErrorMessages({ ...errorMessages, odd1Error: '' })} // Clear error on focus
                        />
                    </View>
                    {errorMessages.odd1Error ? <Text style={styles.errorText}>{errorMessages.odd1Error}</Text> : null}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Stake 1 (Optional)</Text>
                    <View style={styles.inputRow}>
                        <Feather name="arrow-up-right" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={stake1}
                            onChangeText={handleStake1Change}
                            placeholder="Calculated Automatically"
                            onFocus={() => setStake1('')} // Clear calculated value on focus if user wants to manually input
                        />
                    </View>
                </View>
            </View>


            <View style={styles.card}>
                <Text style={styles.inputGroupLabel}>Bet Option 2</Text>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Odd 2</Text>
                    <View style={[styles.inputRow, errorMessages.odd2Error ? styles.inputRowError : null]}>
                        <Feather name="aperture" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={odd2}
                            onChangeText={setOdd2}
                            placeholder="e.g., 2.10"
                            onFocus={() => setErrorMessages({ ...errorMessages, odd2Error: '' })} // Clear error on focus
                        />
                    </View>
                    {errorMessages.odd2Error ? <Text style={styles.errorText}>{errorMessages.odd2Error}</Text> : null}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Stake 2 (Optional)</Text>
                    <View style={styles.inputRow}>
                        <Feather name="arrow-up-right" size={20} color="#888" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={stake2}
                            onChangeText={handleStake2Change}
                            placeholder="Calculated Automatically"
                            onFocus={() => setStake2('')} // Clear calculated value on focus if user wants to manually input
                        />
                    </View>
                </View>
            </View>


            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Total Stake</Text>
                <View style={[styles.inputRow, errorMessages.totalStakeError ? styles.inputRowError : null]}>
                    <Feather name="briefcase" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={totalStake}
                        onChangeText={handleTotalStakeChange}
                        placeholder="Enter Total Stake"
                        onFocus={() => setErrorMessages({ ...errorMessages, totalStakeError: '' })} // Clear error on focus
                    />
                </View>
                {errorMessages.totalStakeError ? <Text style={styles.errorText}>{errorMessages.totalStakeError}</Text> : null}
            </View>


            <TouchableOpacity style={styles.calculateButton} onPress={calculateStakeValues}>
                <Text style={styles.buttonText}>Calculate Sure Bet</Text>
            </TouchableOpacity>

            {result && (
                <View style={styles.resultsCard}>
                    <Text style={styles.resultsLabel}>Calculated Stakes & Profit</Text>
                    <View style={styles.results}>
                        <Text style={styles.resultText}>Stake for Option 1: <Text style={styles.resultValue}>{result.stake1.toFixed(2)}</Text></Text>
                        <Text style={styles.resultText}>Stake for Option 2: <Text style={styles.resultValue}>{result.stake2.toFixed(2)}</Text></Text>
                        <Text style={styles.resultText}>Total Stake: <Text style={styles.resultValue}>{totalStake}</Text></Text>
                        <Text style={styles.resultText}>Profit: <Text style={styles.resultValue}>{result.profit.toFixed(2)}</Text></Text>

                        <Text
                            style={[
                                styles.profitText,
                                {
                                    color: result.profit > 0 ? '#27ae60' : '#e74c3c',
                                    fontWeight: 'bold',
                                },
                            ]}
                        >
                            Profit Percentage: <Text style={styles.resultValue}>{result.profitPercentage}%</Text>
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f2f5', // Softer light grey background
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 32, // Slightly larger title
        fontWeight: 'bold',
        marginBottom: 35, // More margin below title
        textAlign: 'center',
        color: '#34495e',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15, // More rounded card corners
        padding: 20,
        marginBottom: 25, // Margin below each card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
    },
    inputGroupLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
        fontWeight: '500', // Slightly bolder input labels
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcfcfc', // Slightly off-white input background
        borderRadius: 12, // More rounded input corners
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    inputRowError: {
        borderColor: '#e74c3c',
    },
    icon: {
        marginRight: 10,
        color: '#777',
    },
    input: {
        height: 50,
        fontSize: 18,
        flex: 1,
        color: '#333', // Darker input text
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5,
    },
    calculateButton: {
        backgroundColor: '#3498db', // More vibrant blue
        paddingVertical: 16, // Slightly larger button padding
        borderRadius: 12, // Rounded button corners
        marginTop: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4, // For Android shadow
    },
    buttonText: {
        color: '#fff',
        fontSize: 19, // Slightly larger button text
        fontWeight: '600',
    },
    resultsCard: {
        marginTop: 40,
        backgroundColor: '#ffffff', // White results card background
        padding: 25, // More padding in results card
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3, // For Android shadow
        borderColor: '#eee',
        borderWidth: 1,
    },
    resultsLabel: {
        fontSize: 22,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 20,
        textAlign: 'center', // Center align results label
    },
    results: {
        // Styles for the content within the results card if needed
    },
    resultText: {
        fontSize: 18,
        marginBottom: 10, // Slightly more spacing between result lines
        color: '#34495e',
        fontWeight: '500', // Slightly bolder result text
    },
    resultValue: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    profitText: {
        fontSize: 19, // Slightly larger profit text
        marginTop: 12,
    },
});

export default SureBetCalculator;