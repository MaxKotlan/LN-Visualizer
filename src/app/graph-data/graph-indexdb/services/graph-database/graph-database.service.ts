import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChunkInfo } from 'api/src/models/chunkInfo.interface';
import Dexie from 'dexie';
import { LndNodeWithPosition } from 'src/app/types/node-position.interface';
import {
    initializeGraphSyncProcess,
    processChunkInfo,
    processGraphChannelChunk,
    processGraphNodeChunk,
    setIsLoadFromStorage,
} from '../../../graph-process-data/actions';
import {
    ChannelRegistryService,
    NodeRegistryService,
} from 'src/app/graph-data/data-registries/services';

@Injectable({
    providedIn: 'root',
})
export class GraphDatabaseService {
    public db: Dexie = new Dexie('graph');

    constructor(
        private nodeRegistry: NodeRegistryService,
        private channelRegistry: ChannelRegistryService,
        private store$: Store<any>,
    ) {
        this.initDatabase();
    }

    public initDatabase() {
        this.db.version(2).stores({
            /*For performance reasons, storing data as singular object*/
            chunkInfo: 'id,data',
            nodes: 'id,data',
            channels: 'id,data',
        });
    }

    public deleteDatabase() {
        this.db.delete();
    }

    async saveChunkInfo(chunkInfo: ChunkInfo) {
        if (chunkInfo)
            this.db['chunkInfo'].add({ id: 0, data: chunkInfo }).catch((e) => {
                if (e.message.contains('QuotaExceededError'))
                    localStorage.setItem('database-save-error', e);
            });
    }

    async save() {
        const nReg = Array.from(this.nodeRegistry.values()).map((n: LndNodeWithPosition) => ({
            ...n,
            connected_channels: undefined,
            node_capacity: undefined,
            node_channel_count: undefined,
        }));
        this.db['nodes'].add({ id: 0, data: nReg }).catch((e) => {
            if (e.message.contains('QuotaExceededError'))
                localStorage.setItem('database-save-error', e);
        });
        const cReg = Array.from(this.channelRegistry.values());
        this.db['channels'].add({ id: 0, data: cReg }).catch((e) => {
            if (e.message.contains('QuotaExceededError'))
                localStorage.setItem('database-save-error', e);
        });
        localStorage.setItem('database-sync-time', new Date().toISOString());
    }

    async load() {
        let start = performance.now();

        const chunkInfo = await this.loadChunkInfo();
        this.store$.dispatch(processChunkInfo({ chunkInfo: chunkInfo.data }));
        const nodes = await this.loadNodes();
        this.store$.dispatch(processGraphNodeChunk({ chunk: { data: nodes.data } as any }));
        const channels = await this.loadChannels();
        if (!!channels?.data) {
            this.store$.dispatch(
                processGraphChannelChunk({ chunk: { data: channels.data } as any }),
            );
        } else {
            this.store$.dispatch(setIsLoadFromStorage({ isLoadFromStorage: false }));
            this.store$.dispatch(initializeGraphSyncProcess({ overrideSync: 'initsync_c0' }));
        }

        console.log('Loading from cache', performance.now() - start);
    }

    async loadChunkInfo() {
        return await this.db['chunkInfo'].get(0);
    }

    async loadChannels() {
        return await this.db['channels'].get(0);
    }

    async loadNodes() {
        return await this.db['nodes'].get(0);
    }

    async databaseExists() {
        const databaseError = localStorage.getItem('database-save-error');
        return (await Dexie.exists('graph')) && !databaseError;
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
