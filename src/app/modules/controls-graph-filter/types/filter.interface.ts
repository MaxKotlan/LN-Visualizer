export interface Transform {
    keyname: string;
    operator: '+' | '-' | '*' | '/';
    operand: number;
}

export interface Filter<T> {
    keyname: string;
    operator: string;
    operand: T;
}
