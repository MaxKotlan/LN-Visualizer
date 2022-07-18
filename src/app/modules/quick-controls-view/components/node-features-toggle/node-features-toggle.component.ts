import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { nodeFeatures } from 'src/app/modules/node-features/selectors/node-features.selectors';

@Component({
    selector: 'app-node-features-toggle',
    templateUrl: './node-features-toggle.component.html',
    styleUrls: ['./node-features-toggle.component.scss'],
})
export class NodeFeaturesToggleComponent {
    constructor(private store: Store) {
        this.features.subscribe((x) => console.log(x.map((y) => y.bit)));
    }

    public features = this.store.select(nodeFeatures);
}
