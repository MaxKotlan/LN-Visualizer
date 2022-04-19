import { Injectable } from '@angular/core';
import { ChannelRegistryService } from '../channel-registry/channel-registry.service';
import { NodeRegistryService } from '../node-registry/node-registry.service';
import Dexie from 'dexie';

@Injectable({
    providedIn: 'root',
})
export class GraphDatabaseService {
    public db: Dexie = new Dexie('graph');

    constructor(
        private nodeRegistry: NodeRegistryService,
        private channelRegistry: ChannelRegistryService,
    ) {
        this.db.version(1).stores({
            /*For performance reasons, storing data as singular object*/
            nodes: 'id,data',
            channels: 'id,data',
        });
    }

    async save() {
        this.db['nodes'].add({ id: 0, data: this.nodeRegistry });
        this.db['channels'].add({ id: 0, data: this.channelRegistry });
        localStorage.setItem('database-sync-time', new Date().toISOString());
    }

    async loadChannels() {
        return await this.db['channels'].get(0);
    }

    async loadNodes() {
        return await this.db['nodes'].get(0);
    }

    //     const channels = Array.from(this.channelRegistry.values()).map((c) => ({
    //         id: c.id,
    //         capacity: c.capacity,
    //     }));

    //     this.db['channels']
    //         .bulkAdd(channels)
    //         .then(function (lastKey) {
    //             console.log('Done adding 100,000 raindrops all over the place');
    //             console.log("Last raindrop's id was: " + lastKey); // Will be 100000.
    //         })
    //         .catch(Dexie.BulkError, function (e) {
    //             // Explicitely catching the bulkAdd() operation makes those successful
    //             // additions commit despite that there were errors.
    //             console.error(
    //                 'Some raindrops did not succeed. However, ' +
    //                     (this.channelRegistry.size() - e.failures.length) +
    //                     ' raindrops was added successfully',
    //             );
    //         });
    // }
}
