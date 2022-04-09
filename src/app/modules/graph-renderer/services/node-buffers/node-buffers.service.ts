import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import * as graphSelectors from '../../selectors';

export class BufferV2<T> {
    public data: T;
    public onUpdate: BehaviorSubject<void>;
}

@Injectable({
    providedIn: 'root',
})
export class NodeBuffersService {
    public vertex: BufferV2<Float32Array>;
    public color: BufferV2<Uint8Array>;
    public capacity: BufferV2<Float32Array>;

    constructor(private store$: Store<any>) {
        this.store$.select(graphSelectors.selectNodeVertexBufferSize).subscribe((size) => {
            this.vertex = {} as BufferV2<Float32Array>;
            this.vertex.data = new Float32Array(size);
            this.vertex.onUpdate = new BehaviorSubject<void>(undefined);
            this.vertex.onUpdate.next();
        });
        this.store$.select(graphSelectors.selectNodeColorBufferSize).subscribe((size) => {
            this.color = {} as BufferV2<Uint8Array>;
            this.color.data = new Uint8Array(size);
            this.color.onUpdate = new BehaviorSubject<void>(undefined);
            this.color.onUpdate.next();
        });
        this.store$.select(graphSelectors.selectNodeCapacityBufferSize).subscribe((size) => {
            this.capacity = {} as BufferV2<Float32Array>;
            this.capacity.data = new Float32Array(size);
            this.capacity.onUpdate = new BehaviorSubject<void>(undefined);
            this.capacity.onUpdate.next();
        });
    }
}
