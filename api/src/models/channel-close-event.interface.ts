import { Event } from './event.interface';

export interface ChannelCloseEvent extends Event<string> {
    type: 'channel-close';
}
