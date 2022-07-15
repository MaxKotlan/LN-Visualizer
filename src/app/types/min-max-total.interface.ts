export const initMinMaxTotal: MinMaxTotal = {
    min: Infinity,
    max: 0,
    total: 0,
    count: 0,
    average: NaN,
};

export interface MinMaxTotal {
    min: number;
    max: number;
    total: number;
    count: number;
    average: number;
}
