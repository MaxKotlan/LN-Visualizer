import { Injectable } from '@angular/core';
import { deserialize, serialize } from 'bson';
import { Chunk } from '../types/chunk.interface';
import { LndNode } from '../types/node.interface';

@Injectable()
export class ChunkSerializer {
    serialize(obj: Partial<Chunk<any>>): Buffer {
        return serialize(obj);
    }

    deserialize(obj: Buffer): Partial<Chunk<LndNode>> {
        return deserialize(obj);
    }
}
