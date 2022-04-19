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
        // console.log(this.db);
        this.db.config.debug = false;
        // this.load();
    }

    public save() {
        // console.log('Saving', channel);
        // this.dbService.bulkAdd('nodes', Array.from(this.nodeRegistry));
        const channels = Array.from(this.channelRegistry.values());

        console.log('saving');

        const trimed = channels.map((c) => ({ id: c.id, capacity: c.capacity }));
        console.log(trimed);
        console.log(this.db.collection('channels'));

        this.db
            .collection('channels')
            .set(trimed)
            .catch((error) => {
                console.log('There was an error, do something else.');
                console.log(error);
            });

        const a: Promise<any> = this.db.collection('channels').get();

        a.then((c) => console.log('test', c));

        // const chunkSize = 200;
        // for (let i = 0; i < channels.length; i += chunkSize) {
        //     const chunk = channels.slice(i, i + chunkSize);
        //     this.db.collection('channels').update(chunk.map);
        // }

        // console.log(channels);
        // console.log('setting');
        // if (this.shouldLoad) this.db.collection('channels').set(channels);
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
