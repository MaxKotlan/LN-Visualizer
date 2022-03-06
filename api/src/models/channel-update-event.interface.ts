import { Event } from './event.interface';

export interface ChannelUpdatedEvent extends Event<string> {
    type: 'channel-updated';
}
