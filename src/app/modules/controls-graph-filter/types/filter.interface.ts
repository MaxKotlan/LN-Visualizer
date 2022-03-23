import { LndChannel } from 'api/src/models/channels.interface';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';

export type NodeCallback = (n: LndNodeWithPosition) => boolean;
export type ChannelCallback = (n: LndChannel) => boolean;

export interface Filter<T> {
    interpreter: 'lnscript' | 'javascript';
    source?: string;
    function?: T;
    expression?: string[];
    issueId?: string | undefined;
}
