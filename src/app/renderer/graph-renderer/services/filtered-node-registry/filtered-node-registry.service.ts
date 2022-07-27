import { Injectable } from '@angular/core';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';

type NodePublicKey = string;

@Injectable({
    providedIn: 'root',
})
export class FilteredNodeRegistryService extends Map<NodePublicKey, LndNodeWithPosition> {}
