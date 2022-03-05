import { MinMaxTotal } from 'src/app/types/min-max-total.interface';

export const updateCurrentMinMaxTotalStats = (
    currentState: MinMaxTotal,
    capacity: number,
): MinMaxTotal => {
    return {
        min: capacity < currentState.min ? capacity : currentState.min,
        max: capacity > currentState.max ? capacity : currentState.max,
        total: (currentState.total += capacity),
    };
};
