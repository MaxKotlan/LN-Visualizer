import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectNodeSize } from 'src/app/modules/controls-node/selectors/node-controls.selectors';

@Injectable({
    providedIn: 'root',
})
export class NodeSizeOffsetService {
    constructor(private store$: Store) {
        this.store$.select(selectNodeSize).subscribe((uniformSize) => {
            this.uniformSize = uniformSize;
        });
    }

    public uniformSize: number;

    getPointSize() {
        return this.uniformSize;
    }
}
