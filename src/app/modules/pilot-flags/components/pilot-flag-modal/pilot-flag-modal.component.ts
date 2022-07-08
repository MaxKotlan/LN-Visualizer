import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as pilotFlagActions from '../../actions/pilot-flags.actions';
import { allPilotFlags$ } from '../../selectors';
import { take } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-pilot-flag-modal',
    templateUrl: './pilot-flag-modal.component.html',
    styleUrls: ['./pilot-flag-modal.component.scss'],
})
export class PilotFlagModalComponent {
    constructor(
        private store$: Store<any>,
        public dialogRef: MatDialogRef<PilotFlagModalComponent>,
    ) {
        this.pilotFlag$.pipe(take(1)).subscribe((pilotFlags) => {
            this.pilotFlags = pilotFlags;
        });
    }

    public pilotFlags: Record<string, any>[];

    public pilotFlag$ = this.store$.select(allPilotFlags$).pipe(map(Object.entries));

    public updatePilotFlag(pilotName: string, event: MatSlideToggleChange) {
        this.pilotFlags[pilotName] = event.checked;
        this.store$.dispatch(pilotFlagActions.setPilotFlag({ pilotName, value: event.checked }));
    }
}
