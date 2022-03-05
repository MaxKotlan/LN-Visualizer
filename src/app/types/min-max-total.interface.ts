export const initMinMaxTotal: MinMaxTotal = {
    min: Infinity,
    max: 0,
    total: 0,
};

export interface MinMaxTotal {
    min: number;
    max: number;
    total: number;
}
