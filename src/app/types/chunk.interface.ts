export interface Chunk<T> {
    index: number;
    data: T[];
    type: string;
    registry: Record<string, number>;
}
