import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    selectMinimumNodeSize,
    selectNodeSize,
} from 'src/app/ui/settings/controls-node/selectors/node-controls.selectors';

@Injectable({
    providedIn: 'root',
})
export class NodeSizeOffsetService {
    constructor(private store$: Store) {
        //this.handleUpdates();
    }

    handleUpdates() {
        this.store$.select(selectNodeSize).subscribe((uniformSize) => {
            this.maximumSize = uniformSize;
        });
        this.store$
            .select(selectMinimumNodeSize)
            .subscribe((minimumSize) => (this.minimumSize = minimumSize));
    }

    public minimumSize: number;
    public maximumSize: number;

    getPointSize() {
        //return this.maximumSize + this.minimumSize;
        return 1.0;
    }
}
