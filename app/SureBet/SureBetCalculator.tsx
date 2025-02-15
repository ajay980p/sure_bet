import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Result {
    stake1: number;
    stake2: number;
    profit: number;
    profitPercentage: number;
    payout1: number; // Added payout for Bet 1
    payout2: number; // Added payout for Bet 2
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

    const validateInputs = () => {
        let isValid = true;
        const newErrors = { ...errorMessages };

        const odd1Parsed = parseFloat(odd1);
        const odd2Parsed = parseFloat(odd2);
        const totalStakeParsed = parseFloat(totalStake);

        if (isNaN(odd1Parsed) || odd1Parsed <= 0) {
            newErrors.odd1Error = 'Enter valid Odd 1 (> 0)';
            isValid = false;
        } else {
            newErrors.odd1Error = '';
        }

        if (isNaN(odd2Parsed) || odd2Parsed <= 0) {
            newErrors.odd2Error = 'Enter valid Odd 2 (> 0)';
            isValid = false;
        } else {
            newErrors.odd2Error = '';
        }

        if (isNaN(totalStakeParsed) || totalStakeParsed <= 0) {
            newErrors.totalStakeError = 'Enter valid Total Stake (> 0)';
            isValid = false;
        } else {
            newErrors.totalStakeError = '';
        }

        setErrorMessages(newErrors);
        return isValid;
    };


    const calculateStakeValues = () => {
        if (!validateInputs()) {
            return;
        }

        const odd1Parsed = parseFloat(odd1);
        const odd2Parsed = parseFloat(odd2);
        const totalStakeParsed = parseFloat(totalStake);

        const arbitrageSumInverseOdds = (1 / odd1Parsed) + (1 / odd2Parsed); // Correct Arbitrage sum of inverse odds
        const stake1Calculated =
            (1 / odd1Parsed) /
            arbitrageSumInverseOdds * // Use the correct sum here
            totalStakeParsed;
        const stake2Calculated =
            (1 / odd2Parsed) /
            arbitrageSumInverseOdds * // Use the correct sum here
            totalStakeParsed;

        console.log("Odds used for calculation: ", stake1Calculated, stake2Calculated)

        const payout1Calculated = stake1Calculated * odd1Parsed; // Calculate payout for Bet 1
        const payout2Calculated = stake2Calculated * odd2Parsed; // Calculate payout for Bet 2

        console.log("Payout 1 and Payout 2 : ", payout1Calculated, payout2Calculated, totalStakeParsed)

        const profit = payout1Calculated - totalStakeParsed; // Correct Profit Calculation (using payout1, could use payout2 as well)
        const profitPercentage = (profit / totalStakeParsed) * 100; // Correct Profit Percentage Calculation
        const roundedProfitPercentage = profitPercentage.toFixed(2); // Round percentage to 2 decimal places

        setResult({
            stake1: stake1Calculated,
            stake2: stake2Calculated,
            profit: profit, // Use the corrected profit
            profitPercentage: parseFloat(roundedProfitPercentage), // Use corrected profit percentage
            payout1: payout1Calculated,
            payout2: payout2Calculated,
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
            const payout1Calculated = newStake1 * odd1Parsed; // Calculate payout for Bet 1
            const payout2Calculated = stake2Calculated * odd2Parsed; // Calculate payout for Bet 2

            setStake1(value);
            setStake2(stake2Calculated.toFixed(2));

            setResult({
                stake1: newStake1,
                stake2: stake2Calculated,
                profit: totalStakeParsed - (newStake1 + stake2Calculated),
                profitPercentage: ((totalStakeParsed - (newStake1 + stake2Calculated)) / totalStakeParsed) * 100,
                payout1: payout1Calculated, // Store payout for Bet 1
                payout2: payout2Calculated, // Store payout for Bet 2
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
            const payout1Calculated = stake1Calculated * odd1Parsed; // Calculate payout for Bet 1
            const payout2Calculated = newStake2 * odd2Parsed; // Calculate payout for Bet 2

            setStake2(value);
            setStake1(stake1Calculated.toFixed(2));
            setResult({
                stake1: stake1Calculated,
                stake2: newStake2,
                profit: totalStakeParsed - (stake1Calculated + newStake2),
                profitPercentage: ((totalStakeParsed - (stake1Calculated + newStake2)) / totalStakeParsed) * 100,
                payout1: payout1Calculated, // Store payout for Bet 1
                payout2: payout2Calculated, // Store payout for Bet 2
            });
        }
    };

    const handleTotalStakeChange = (value: string) => {
        const newTotalStake = parseFloat(value);
        if (!isNaN(newTotalStake) && newTotalStake > 0) {
            setTotalStake(value);
            calculateStakeValues();
        } else {
            setErrorMessages({ ...errorMessages, totalStakeError: 'Enter valid Total Stake (> 0)' });
            setTotalStake('');
        }
    };

    const clearError = (fieldName: 'odd1Error' | 'odd2Error' | 'totalStakeError') => {
        setErrorMessages({ ...errorMessages, [fieldName]: '' });
    };

    const resetCalculator = () => {
        setOdd1('');
        setOdd2('');
        setStake1('');
        setStake2('');
        setTotalStake('');
        setResult(null);
        setErrorMessages({
            odd1Error: '',
            odd2Error: '',
            totalStakeError: '',
        });
    };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Sure Bet Calculator</Text>

                <View style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Odd 1</Text>
                        <View style={[styles.inputRow, errorMessages.odd1Error ? styles.inputRowError : null]}>
                            <Feather name="aperture" size={18} color="#888" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={odd1}
                                onChangeText={setOdd1}
                                placeholder="e.g., 1.80"
                                onFocus={() => clearError('odd1Error')}
                            />
                        </View>
                        {errorMessages.odd1Error ? <Text style={styles.errorText}>{errorMessages.odd1Error}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Odd 2</Text>
                        <View style={[styles.inputRow, errorMessages.odd2Error ? styles.inputRowError : null]}>
                            <Feather name="aperture" size={18} color="#888" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={odd2}
                                onChangeText={setOdd2}
                                placeholder="e.g., 2.10"
                                onFocus={() => clearError('odd2Error')}
                            />
                        </View>
                        {errorMessages.odd2Error ? <Text style={styles.errorText}>{errorMessages.odd2Error}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Stake</Text>
                        <View style={[styles.inputRow, errorMessages.totalStakeError ? styles.inputRowError : null]}>
                            <Feather name="briefcase" size={18} color="#888" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={totalStake}
                                onChangeText={handleTotalStakeChange}
                                placeholder="Enter Total Stake"
                                onFocus={() => clearError('totalStakeError')}
                            />
                        </View>
                        {errorMessages.totalStakeError ? <Text style={styles.errorText}>{errorMessages.totalStakeError}</Text> : null}
                    </View>

                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.calculateButton} onPress={calculateStakeValues} disabled={!!errorMessages.odd1Error || !!errorMessages.odd2Error || !!errorMessages.totalStakeError}>
                        <Text style={styles.buttonText}>Calculate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
                        <Text style={styles.buttonText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card}>
                    <Text style={styles.inputGroupLabel}>Optional Stake Adjustment</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Stake 1</Text>
                        <View style={styles.inputRow}>
                            <Feather name="arrow-up-right" size={18} color="#888" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={stake1}
                                onChangeText={handleStake1Change}
                                placeholder="Auto"
                                onFocus={() => setStake1('')}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Stake 2</Text>
                        <View style={styles.inputRow}>
                            <Feather name="arrow-up-right" size={18} color="#888" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={stake2}
                                onChangeText={handleStake2Change}
                                placeholder="Auto"
                                onFocus={() => setStake2('')}
                            />
                        </View>
                    </View>
                </View>


                {result && (
                    <View style={styles.resultsCard}>
                        <Text style={styles.resultsLabel}>Calculation Results</Text>
                        <View style={styles.results}>
                            <Text style={styles.resultText}>Stake Bet 1: <Text style={styles.resultValue}>{result.stake1.toFixed(2)}</Text></Text>
                            <Text style={styles.resultText}>Stake Bet 2: <Text style={styles.resultValue}>{result.stake2.toFixed(2)}</Text></Text>
                            <Text style={styles.resultText}>Total Stake: <Text style={styles.resultValue}>{totalStake}</Text></Text>
                            <Text style={styles.resultText}>Potential Payout Bet 1: <Text style={styles.resultValue}>{result.payout1.toFixed(2)}</Text></Text>
                            <Text style={styles.resultText}>Potential Payout Bet 2: <Text style={styles.resultValue}>{result.payout2.toFixed(2)}</Text></Text>
                            <Text style={styles.resultText}>Total Profit: <Text style={styles.resultValue}>{result.profit.toFixed(2)}</Text></Text>

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
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingTop: 30
    },
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 25,
        backgroundColor: '#f0f2f5',
        justifyContent: 'center', // Center content vertically
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15, // Increased marginBottom for title
        textAlign: 'center',
        color: '#34495e',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18, // Slightly increased padding for cards
        marginBottom: 15, // Increased marginBottom for cards
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // Slightly increased shadow
        shadowOpacity: 0.15, // Slightly increased shadow opacity
        shadowRadius: 4, // Slightly adjusted shadow radius
        elevation: 3, // Slightly increased elevation
    },
    inputGroupLabel: {
        fontSize: 20, // Increased label size
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 12, // Increased marginBottom for labels
        textAlign: 'center', // Center Input Group Labels
    },
    inputGroup: {
        marginBottom: 12, // Increased marginBottom for input groups
    },
    inputLabel: {
        fontSize: 16, // Increased input label size
        color: '#555',
        marginBottom: 6, // Adjusted marginBottom for input labels
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcfcfc',
        borderRadius: 10,
        paddingHorizontal: 12, // Increased padding in input row
        borderWidth: 1,
        borderColor: '#ddd',
        height: 40, // Slightly increased input height
    },
    inputRowError: {
        borderColor: '#e74c3c',
    },
    icon: {
        marginRight: 10, // Increased icon margin
        color: '#777',
        fontSize: 18, // Increased icon size
    },
    input: {
        height: 40, // Increased height to match inputRow
        fontSize: 16, // Increased input text size
        flex: 1,
        color: '#333',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 13, // Slightly increased error text size
        marginTop: 4, // Adjusted marginTop for error text
        marginLeft: 4, // Adjusted marginLeft for error text
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Evenly space buttons
        marginTop: 10, // Increased marginTop for buttons
        marginBottom: 20, // Increased marginTop for buttons
    },
    calculateButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10, // Increased button padding
        borderRadius: 12, // Increased button borderRadius
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // Increased button shadow
        shadowOpacity: 0.2,
        shadowRadius: 4, // Adjusted button shadow radius
        elevation: 4, // Increased button elevation
        flex: 1,
        marginHorizontal: 5, // Adjusted button horizontal margin
    },
    resetButton: {
        backgroundColor: '#e07a5f',
        paddingVertical: 10, // Increased button padding
        borderRadius: 12, // Increased button borderRadius
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // Increased button shadow
        shadowOpacity: 0.2,
        shadowRadius: 4, // Adjusted button shadow radius
        elevation: 4, // Increased button elevation
        flex: 1,
        marginHorizontal: 5, // Adjusted button horizontal margin
    },
    buttonText: {
        color: '#fff',
        fontSize: 18, // Increased button text size
        fontWeight: '600',
    },
    resultsCard: {
        marginTop: 20, // Increased marginTop for results card
        backgroundColor: '#f0f0f5',
        padding: 20, // Increased padding for results card
        borderRadius: 15, // Increased borderRadius for results card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 }, // Increased shadow for results card
        shadowOpacity: 0.15, // Slightly increased shadow opacity
        shadowRadius: 4, // Adjusted shadow radius
        elevation: 3, // Increased elevation
        borderColor: '#ddd',
        borderWidth: 1,
    },
    resultsLabel: {
        fontSize: 24, // Increased results label size
        fontWeight: '700',
        color: '#34495e',
        marginBottom: 15, // Increased marginBottom for results label
        textAlign: 'center',
    },
    results: {
        paddingHorizontal: 10, // Increased padding in results
    },
    resultText: {
        fontSize: 17, // Increased result text size
        marginBottom: 12, // Increased marginBottom for result text
        color: '#4a6572',
        fontWeight: '500',
        lineHeight: 24, // Increased line height for results
    },
    resultValue: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    profitText: {
        fontSize: 20, // Increased profit text size
        marginTop: 15, // Increased marginTop for profit text
        fontWeight: '700', // Made profit text bolder
        textAlign: 'center',
        color: '#27ae60',
    },
});

export default SureBetCalculator;