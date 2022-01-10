import { injectable } from 'inversify';
import { WebSocket } from 'ws';
import { ChannelCloseEvent } from '../models/channel-close-event.interface';

@injectable()
export class ChannelCloseService {
    constructor() {}

    public forwardChannelCloseEvent(ws: WebSocket, channelId: string) {
        ws.send(JSON.stringify({ type: 'channel-close', data: channelId } as ChannelCloseEvent));
    }
}
