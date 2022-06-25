import { LndChannel } from 'api/src/models/channels.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';

export type NodeEvaluationFunction = (n: LndNodeWithPosition) => boolean;
export type ChannelEvaluationFunction = (n: LndChannel) => boolean;

export interface Filter<T> {
    interpreter: 'javascript';
    source?: string;
    function?: T;
    expression?: string[];
    issueId?: string | undefined;
}
