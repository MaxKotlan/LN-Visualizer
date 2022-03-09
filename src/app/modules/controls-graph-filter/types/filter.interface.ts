export interface Filter<T> {
    keyname: string;
    operator: string;
    operand: T;
}
