import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { setNetworkFilter } from 'src/app/modules/controls-node/actions';
import { networkOptions, NodeControlState } from 'src/app/modules/controls-node/reducer';
import { selectNetworkFilter } from 'src/app/modules/controls-node/selectors/node-controls.selectors';

@Component({
    selector: 'app-clearnet-onion-toggle',
    templateUrl: './clearnet-onion-toggle.component.html',
    styleUrls: ['./clearnet-onion-toggle.component.scss'],
})
export class ClearnetOnionToggleComponent {
    constructor(private store$: Store<NodeControlState>) {}

    public networkFilter$: Observable<string> = this.store$.select(selectNetworkFilter);

    public options = networkOptions;

    valueChanged(event) {
        this.store$.dispatch(setNetworkFilter({ value: event }));
    }
}
