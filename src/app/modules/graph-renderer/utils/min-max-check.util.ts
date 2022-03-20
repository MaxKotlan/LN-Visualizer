import { MinMax, MinMaxTotal } from 'src/app/types/min-max-total.interface';

export const updateCurrentMinMaxTotalStats = (
    currentState: MinMaxTotal | MinMax,
    capacity: number,
): MinMaxTotal | MinMax => {
    if ((currentState as MinMaxTotal).total !== undefined) {
        return {
            min: capacity < currentState.min ? capacity : currentState.min,
            max: capacity > currentState.max ? capacity : currentState.max,
            total: (currentState as MinMaxTotal).total + capacity,
        };
    } else {
        return {
            min: capacity < currentState.min ? capacity : currentState.min,
            max: capacity > currentState.max ? capacity : currentState.max,
        };
    }
};
