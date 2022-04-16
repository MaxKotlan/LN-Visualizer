import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';

type NodePublicKey = string;

@Injectable({
    providedIn: 'root',
})
export class FilteredNodeRegistryService extends Map<NodePublicKey, LndChannel> {}
