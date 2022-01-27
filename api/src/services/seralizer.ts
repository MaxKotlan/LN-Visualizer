import * as BSON from 'bson';
import { Chunk, LndNode } from '../models';

export class ChunkSerializer {
    serialize(obj: any): Buffer {
        return BSON.serialize(obj);
    }

    deserialize(obj: any): Partial<Chunk<LndNode>> {
        return BSON.deserialize(obj);
    }
}
