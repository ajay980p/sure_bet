import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styles from './styles';
import OddInput from './OddInput';
import StakeInput from './StakeInput';
import OptionalStakeAdjustments from './OptionalStakeAdjustments';
import CalculationButtons from './CalculationButtons';
import ResultsCard from './ResultsCard';
import { validateInputs, calculateStakeValues } from '../../utils/CalculatorUtils';

export interface Result {
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

    const clearError = useCallback((fieldName: 'odd1Error' | 'odd2Error' | 'totalStakeError') => {
        setErrorMessages({ ...errorMessages, [fieldName]: '' });
    }, [setErrorMessages]);


    const resetCalculator = useCallback(() => {
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
    }, [setErrorMessages, setOdd1, setOdd2, setStake1, setStake2, setTotalStake, setResult, setIsCalculated]);


    const handleCalculate = useCallback(() => {
        calculateStakeValues(
            odd1,
            odd2,
            totalStake,
            () => validateInputs(odd1, odd2, totalStake, errorMessages, setErrorMessages), // Pass as a callback
            setResult,
            setStake1,
            setStake2,
            setIsCalculated
        );
    }, [odd1, odd2, totalStake, errorMessages, setErrorMessages, setResult, setStake1, setStake2, setIsCalculated]); // Dependencies for useCallback

    const handleTotalStakeChange = useCallback((value: string) => {
        const newTotalStake = parseFloat(value);
        if (!isNaN(newTotalStake) && newTotalStake > 0) {
            setTotalStake(value);
            if (isCalculated) {
                handleCalculate(); // Recalculate if already calculated
            }
        } else {
            setErrorMessages({ ...errorMessages, totalStakeError: 'Enter valid Total Stake (> 0)' });
            setTotalStake('');
            setIsCalculated(false);
            setResult(null);
        }
    }, [errorMessages, isCalculated, setErrorMessages, setTotalStake, setResult, setIsCalculated, handleCalculate]);

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
    }, [odd1, odd2, result, setResult, setStake1, setStake2, setTotalStake, setIsCalculated, setErrorMessages, errorMessages]);

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
    }, [odd1, odd2, result, setResult, setStake1, setStake2, setTotalStake, setIsCalculated, setErrorMessages, errorMessages]);


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Sure Bet Calculator</Text>

                <View style={styles.card}>
                    <OddInput
                        label="Odd 1"
                        value={odd1}
                        onChangeText={setOdd1}
                        error={errorMessages.odd1Error}
                        clearError={() => clearError('odd1Error')}
                    />
                    <OddInput
                        label="Odd 2"
                        value={odd2}
                        onChangeText={setOdd2}
                        error={errorMessages.odd2Error}
                        clearError={() => clearError('odd2Error')}
                    />
                    <StakeInput
                        value={totalStake}
                        onChangeText={handleTotalStakeChange}
                        error={errorMessages.totalStakeError}
                        clearError={() => clearError('totalStakeError')}
                    />
                </View>

                <CalculationButtons
                    onCalculate={handleCalculate}
                    onReset={resetCalculator}
                    disableCalculate={!!errorMessages.odd1Error || !!errorMessages.odd2Error || !!errorMessages.totalStakeError}
                />

                <OptionalStakeAdjustments
                    stake1={stake1}
                    stake2={stake2}
                    handleStake1Change={handleStake1Change}
                    handleStake2Change={handleStake2Change}
                />

                <ResultsCard result={result} totalStakeValue={totalStake} />

            </View>
        </ScrollView>
    );
};


export default SureBetCalculator;