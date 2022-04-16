import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';

type ChannelId = string;

@Injectable({
    providedIn: 'root',
})
export class FilteredChannelRegistryService extends Map<ChannelId, LndChannel> {}
