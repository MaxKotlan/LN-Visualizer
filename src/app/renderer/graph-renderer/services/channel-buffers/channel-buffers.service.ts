import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { BufferV2 } from '../node-buffers/node-buffers.service';
import * as graphSelectors from '../../selectors';

@Injectable({
    providedIn: 'root',
})
export class ChannelBuffersService {
    public vertex: BufferV2<Float32Array>;
    public color: BufferV2<Uint8Array>;
    public thickness: BufferV2<Float32Array>;

    constructor(private store$: Store<any>) {
        this.vertex = {} as BufferV2<Float32Array>;
        this.color = {} as BufferV2<Uint8Array>;
        this.thickness = {} as BufferV2<Float32Array>;

        this.vertex.onUpdate = new BehaviorSubject<number>(0);
        this.color.onUpdate = new BehaviorSubject<number>(0);
        this.thickness.onUpdate = new BehaviorSubject<number>(0);

        this.store$.select(graphSelectors.selectChannelVertexBufferSize).subscribe((size) => {
            this.vertex.size = size;
            this.vertex.data = new Float32Array(size);
            //this.vertex.onUpdate.next();
        });
        this.store$.select(graphSelectors.selectChannelColorBufferSize).subscribe((size) => {
            this.color.size = size;
            this.color.data = new Uint8Array(size);
            //this.color.onUpdate.next();
        });
        this.store$.select(graphSelectors.selectChannelThicknessBufferSize).subscribe((size) => {
            this.thickness.size = size;
            this.thickness.data = new Float32Array(size);
            //this.color.onUpdate.next();
        });
    }
}
