import { MinMaxTotal } from 'src/app/types/min-max-total.interface';

export const updateCurrentMinMaxTotalStats = (
    currentState: MinMaxTotal,
    property: number,
): MinMaxTotal => {
    if (typeof property === 'string') {
        property = Number.parseInt(property);
    }
    if ((currentState as MinMaxTotal).total !== undefined) {
        return {
            min: property < currentState.min ? property : currentState.min,
            max: property > currentState.max ? property : currentState.max,
            total: (currentState as MinMaxTotal).total + property,
            count: (currentState as MinMaxTotal).count + 1,
            average:
                ((currentState as MinMaxTotal).total + property) /
                ((currentState as MinMaxTotal).count + 1),
        };
    }
};
