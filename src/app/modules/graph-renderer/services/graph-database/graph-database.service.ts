import { Injectable } from '@angular/core';
import { LndChannel } from 'api/src/models';
import { ChannelRegistryService } from '../channel-registry/channel-registry.service';
import { NodeRegistryService } from '../node-registry/node-registry.service';
import Localbase from 'localbase';

@Injectable({
    providedIn: 'root',
})
export class GraphDatabaseService {
    public db = new Localbase('channels');

    constructor(
        private nodeRegistry: NodeRegistryService,
        private channelRegistry: ChannelRegistryService,
    ) {
        console.log(this.db);
        this.db.config.debug = true;
        this.load();
    }

    public save(channels) {
        // console.log('Saving', channel);
        // this.dbService.bulkAdd('nodes', Array.from(this.nodeRegistry));
        // const channels = Array.from(this.channelRegistry.values());
        // console.log(channels);
        // console.log('setting');
        if (this.shouldLoad) this.db.collection('channels').set(channels);
    }

    public shouldLoad = true;

    public load() {
        // console.log('getting');
        // this.db
        //     .collection('channels')
        //     .get()
        //     .then((channels) => {
        //         if (channels.length > 0) this.shouldLoad = false;
        //         console.log(channels);
        //     });
    }
}
