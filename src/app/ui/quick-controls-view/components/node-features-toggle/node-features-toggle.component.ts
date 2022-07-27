import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import {
    isNodeFeatureFilterEnabled,
    nodeFeatures,
} from 'src/app/ui/node-features/selectors/node-features.selectors';
import * as nodeFeatureActions from '../../../node-features/actions/node-feature.actions';

@Component({
    selector: 'app-node-features-toggle',
    templateUrl: './node-features-toggle.component.html',
    styleUrls: ['./node-features-toggle.component.scss'],
})
export class NodeFeaturesToggleComponent {
    constructor(private store: Store) {}
    public features = this.store.select(nodeFeatures);
    public filterEnabled = this.store.select(isNodeFeatureFilterEnabled);

    public updateFeature(bit: number, slideEvent: MatSlideToggleChange) {
        this.store.dispatch(
            nodeFeatureActions.updateFeatureFilter({ bit, newValue: slideEvent.checked }),
        );
    }

    public enableFilter(slideEvent: MatSlideToggleChange) {
        this.store.dispatch(
            nodeFeatureActions.enableNodeFeaturesFilter({ isEnabled: slideEvent.checked }),
        );
    }
}
