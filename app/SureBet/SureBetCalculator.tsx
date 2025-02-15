import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Result {
    stake1: number;
    stake2: number;
    profit: number;
    profitPercentage: number;
    payout1: number;
    payout2: number;
    originalStake1Ratio?: number;
    originalStake2Ratio?: number;
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
    const [isCalculated, setIsCalculated] = useState<boolean>(false);

    const validateInputs = useCallback(() => {
        let isValid = true;
        const newErrors = { ...errorMessages };

        const odd1Parsed = parseFloat(odd1);
        const odd2Parsed = parseFloat(odd2);
        const totalStakeParsed = parseFloat(totalStake);

        if (isNaN(odd1Parsed)) {
            newErrors.odd1Error = 'Please enter a valid number for Odd 1';
            isValid = false;
        } else if (odd1Parsed <= 0) {
            newErrors.odd1Error = 'Enter valid Odd 1 (> 0)';
            isValid = false;
        } else {
            newErrors.odd1Error = '';
        }

        if (isNaN(odd2Parsed)) {
            newErrors.odd2Error = 'Please enter a valid number for Odd 2';
            isValid = false;
        } else if (odd2Parsed <= 0) {
            newErrors.odd2Error = 'Enter valid Odd 2 (> 0)';
            isValid = false;
        } else {
            newErrors.odd2Error = '';
        }

        if (isNaN(totalStakeParsed)) {
            newErrors.totalStakeError = 'Please enter a valid number for Stake'; // Specific error for non-numeric
            isValid = false;
        } else if (totalStakeParsed <= 0) {
            newErrors.totalStakeError = 'Enter valid Total Stake (> 0)'; // Original error for <= 0
            isValid = false;
        } else {
            newErrors.totalStakeError = '';
        }

        setErrorMessages(newErrors);
        return isValid;
    }, [odd1, odd2, totalStake, errorMessages]);


    const calculateStakeValues = useCallback(() => {
        if (!validateInputs()) {
            return;
        }

        const odd1Parsed = parseFloat(odd1);
        const odd2Parsed = parseFloat(odd2);
        const totalStakeParsed = parseFloat(totalStake);

        if (totalStakeParsed <= 1e-6) { // Check for near-zero total stake to prevent division by zero in ratios
            setResult(null);
            setStake1('Auto');
            setStake2('Auto');
            setIsCalculated(false);
            return;
        }

        const arbitrageSumInverseOdds = (1 / odd1Parsed) + (1 / odd2Parsed);
        const stake1Calculated =
            (1 / odd1Parsed) /
            arbitrageSumInverseOdds *
            totalStakeParsed;
        const stake2Calculated =
            (1 / odd2Parsed) /
            arbitrageSumInverseOdds *
            totalStakeParsed;

        const payout1Calculated = stake1Calculated * odd1Parsed;
        const payout2Calculated = stake2Calculated * odd2Parsed;

        const profit = payout1Calculated - totalStakeParsed;
        const profitPercentage = (profit / totalStakeParsed) * 100;
        const roundedProfitPercentage = profitPercentage.toFixed(2);

        setResult({
            stake1: stake1Calculated,
            stake2: stake2Calculated,
            profit: profit,
            profitPercentage: parseFloat(roundedProfitPercentage),
            payout1: payout1Calculated,
            payout2: payout2Calculated,
            originalStake1Ratio: stake1Calculated / totalStakeParsed,
            originalStake2Ratio: stake2Calculated / totalStakeParsed,
        });

        setStake1(stake1Calculated.toFixed(2));
        setStake2(stake2Calculated.toFixed(2));
        setIsCalculated(true);
    }, [odd1, odd2, totalStake, validateInputs]);

    const handleTotalStakeChange = useCallback((value: string) => {
        const newTotalStake = parseFloat(value);
        if (!isNaN(newTotalStake) && newTotalStake > 0) {
            setTotalStake(value);
            if (isCalculated) {
                calculateStakeValues();
            }
        } else {
            setErrorMessages({ ...errorMessages, totalStakeError: 'Enter valid Total Stake (> 0)' });
            setTotalStake('');
            setIsCalculated(false);
            setResult(null);
        }
    }, [errorMessages, isCalculated, calculateStakeValues]);

    const handleStake1Change = useCallback((value: string) => {
        const newStake1 = parseFloat(value);

        if (!isNaN(newStake1) && newStake1 >= 0) {
            const odd1Parsed = parseFloat(odd1);
            const odd2Parsed = parseFloat(odd2);

            if (isNaN(odd1Parsed) || odd1Parsed <= 0 || isNaN(odd2Parsed) || odd2Parsed <= 0) {
                setStake1(value);
                setStake2('Auto');
                setTotalStake(value);
                setResult(null);
                setIsCalculated(false);
                return;
            }


            if (result) {
                const originalTotalStake = parseFloat(totalStake);
                const originalStake1Ratio = result.originalStake1Ratio || 0;
                const originalStake2Ratio = result.originalStake2Ratio || 0;

                const newTotalStake = newStake1 / originalStake1Ratio;
                const newStake2 = newTotalStake * originalStake2Ratio;


                if (!isNaN(odd1Parsed) && !isNaN(odd2Parsed) && odd1Parsed > 0 && odd2Parsed > 0) {


                    const payout1Calculated = newStake1 * odd1Parsed;
                    const payout2Calculated = newStake2 * odd2Parsed;
                    const profit = payout1Calculated - newTotalStake;
                    const profitPercentage = (profit / newTotalStake) * 100;
                    const roundedProfitPercentage = profitPercentage.toFixed(2);

                    setStake1(value);
                    setStake2(newStake2.toFixed(2));
                    setTotalStake(newTotalStake.toFixed(2));

                    setResult({
                        stake1: newStake1,
                        stake2: newStake2,
                        profit: profit,
                        profitPercentage: parseFloat(roundedProfitPercentage),
                        payout1: payout1Calculated,
                        payout2: payout2Calculated,
                        originalStake1Ratio: originalStake1Ratio,
                        originalStake2Ratio: originalStake2Ratio,
                    });
                } else {
                    setStake1(value);
                    setStake2('Auto');
                    setTotalStake('Auto');
                    setResult(null);
                    setIsCalculated(false);
                }


            } else {
                setStake1(value);
                setStake2('Auto');
                setTotalStake(value);
                setResult(null);
                setIsCalculated(false);
            }
        } else {
            setStake1(value);
            setStake2('Auto');
            setTotalStake(value);
            setResult(null);
            setIsCalculated(false);
        }
    }, [odd1, odd2, result, setResult, setStake1, setStake2, setTotalStake, setIsCalculated]);

    const handleStake2Change = useCallback((value: string) => {
        const newStake2 = parseFloat(value);
        if (!isNaN(newStake2) && newStake2 >= 0) {
            const odd1Parsed = parseFloat(odd1);
            const odd2Parsed = parseFloat(odd2);

            if (isNaN(odd1Parsed) || odd1Parsed <= 0 || isNaN(odd2Parsed) || odd2Parsed <= 0) {
                setStake1('Auto');
                setStake2(value);
                setTotalStake(value);
                setResult(null);
                setIsCalculated(false);
                return;
            }

            if (result) {
                const originalTotalStake = parseFloat(totalStake);
                const originalStake1Ratio = result.originalStake1Ratio || 0;
                const originalStake2Ratio = result.originalStake2Ratio || 0;

                const newTotalStake = newStake2 / originalStake2Ratio;
                const newStake1 = newTotalStake * originalStake1Ratio;


                if (!isNaN(odd1Parsed) && !isNaN(odd2Parsed) && odd1Parsed > 0 && odd2Parsed > 0) {

                    const payout1Calculated = newStake1 * odd1Parsed;
                    const payout2Calculated = newStake2 * odd2Parsed;
                    const profit = payout2Calculated - newTotalStake;
                    const profitPercentage = (profit / newTotalStake) * 100;
                    const roundedProfitPercentage = profitPercentage.toFixed(2);

                    setStake2(value);
                    setStake1(newStake1.toFixed(2));
                    setTotalStake(newTotalStake.toFixed(2));
                    setResult({
                        stake1: newStake1,
                        stake2: newStake2,
                        profit: profit,
                        profitPercentage: parseFloat(roundedProfitPercentage),
                        payout1: payout1Calculated,
                        payout2: payout2Calculated,
                        originalStake1Ratio: originalStake1Ratio,
                        originalStake2Ratio: originalStake2Ratio,
                    });
                } else {
                    setStake1('Auto');
                    setStake2(value);
                    setTotalStake('Auto');
                    setResult(null);
                    setIsCalculated(false);
                }

            } else {
                setStake2(value);
                setStake1('Auto');
                setTotalStake(value);
                setResult(null);
                setIsCalculated(false);
            }

        } else {
            setStake2(value);
            setStake1('Auto');
            setTotalStake(value);
            setResult(null);
            setIsCalculated(false);
        }
    }, [odd1, odd2, result, setResult, setStake1, setStake2, setTotalStake, setIsCalculated]);


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
        setIsCalculated(false);
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

                    {result && (
                        <View style={styles.results}>
                            <Text style={styles.resultText}>Total Stake : <Text style={styles.resultValue}>{totalStake}</Text></Text>
                            <Text style={styles.resultText}>Total Payout : <Text style={styles.resultValue}>{(parseFloat(totalStake) + parseFloat(result.profit.toFixed(2))).toFixed(2)}</Text></Text>
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
                                ROI (Return On Investment): <Text style={styles.resultValue}>{result.profitPercentage}%</Text>
                            </Text>
                        </View>
                    )}
                </View>
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
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#34495e',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    inputGroupLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 12,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 16,
        color: '#555',
        marginBottom: 6,
        fontWeight: '500',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fcfcfc',
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        height: 40,
    },
    inputRowError: {
        borderColor: '#e74c3c',
    },
    icon: {
        marginRight: 10,
        color: '#777',
        fontSize: 18,
    },
    input: {
        height: 55,
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 13,
        marginTop: 4,
        marginLeft: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 20,
    },
    calculateButton: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        flex: 1,
        marginHorizontal: 5,
    },
    resetButton: {
        backgroundColor: '#e07a5f',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    results: {
        marginTop: 20,
        backgroundColor: '#f0f0f5',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    resultsLabel: {
        fontSize: 24,
        fontWeight: '700',
        color: '#34495e',
        marginBottom: 15,
        textAlign: 'center',
    },
    resultText: {
        fontSize: 17,
        marginBottom: 5,
        color: '#4a6572',
        fontWeight: '500',
        lineHeight: 24,
    },
    resultValue: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    profitText: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        color: '#27ae60',
    },
});

export default SureBetCalculator;