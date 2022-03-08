export interface Filter<T> {
    keyname: string;
    operator: 'gt' | 'gte' | 'lt' | 'lte' | 'ne';
    operand: T;
}
