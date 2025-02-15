import { Dispatch, SetStateAction } from 'react';

interface ErrorMessages {
    odd1Error: string;
    odd2Error: string;
    totalStakeError: string;
}

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

export const validateInputs = (
    odd1: string,
    odd2: string,
    totalStake: string,
    errorMessages: ErrorMessages,
    setErrorMessages: Dispatch<SetStateAction<ErrorMessages>>
): boolean => {
    let isValid = true;
    const newErrors: ErrorMessages = { ...errorMessages };

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
        newErrors.totalStakeError = 'Please enter a valid number for Stake';
        isValid = false;
    } else if (totalStakeParsed <= 0) {
        newErrors.totalStakeError = 'Enter valid Total Stake (> 0)';
        isValid = false;
    } else {
        newErrors.totalStakeError = '';
    }

    setErrorMessages(newErrors);
    return isValid;
};

export const calculateStakeValues = (
    odd1: string,
    odd2: string,
    totalStake: string,
    validateInputsCallback: () => boolean,
    setResult: Dispatch<SetStateAction<Result | null>>,
    setStake1: Dispatch<SetStateAction<string>>,
    setStake2: Dispatch<SetStateAction<string>>,
    setIsCalculated: Dispatch<SetStateAction<boolean>>
): void => {
    if (!validateInputsCallback()) {
        return;
    }

    const odd1Parsed = parseFloat(odd1);
    const odd2Parsed = parseFloat(odd2);
    const totalStakeParsed = parseFloat(totalStake);

    if (totalStakeParsed <= 1e-6) {
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
};