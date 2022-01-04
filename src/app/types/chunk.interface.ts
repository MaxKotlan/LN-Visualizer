export interface Chunk<T> {
    index: number;
    data: T[];
    keyType: string;
    registry: Record<string, number>;
}
