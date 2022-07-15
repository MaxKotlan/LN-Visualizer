export const initMinMax: MinMax = {
    min: Infinity,
    max: 0,
};

export const initMinMaxTotal: MinMaxTotal = {
    ...initMinMax,
    total: 0,
    count: 0,
    average: NaN,
};

export interface MinMax {
    min: number;
    max: number;
}

export interface MinMaxTotal {
    min: number;
    max: number;
    total: number;
    count: number;
    average: number;
}
