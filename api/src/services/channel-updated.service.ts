import { injectable } from 'inversify';
import WebSocket from 'ws';
import { ChannelUpdatedEvent } from '../models/channel-update-event.interface';

@injectable()
export class ChannelUpdatedService {
    constructor() {}

    public forwardChannelUpdatedEvent(ws: WebSocket, channelId: string) {
        ws.send(
            JSON.stringify({ type: 'channel-updated', data: channelId } as ChannelUpdatedEvent),
        );
    }
}
