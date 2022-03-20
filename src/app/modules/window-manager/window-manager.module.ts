import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import * as windowManagementReducer from './reducers';
import { WindowManagerComponent } from './components/window-manager/window-manager.component';
import { MaterialModule } from '../material';
import { ScreenSizeModule } from '../screen-size/screen-size.module';
import { QuickControlsViewModule } from '../quick-controls-view/quick-controls-view.module';
import { GraphViewModule } from '../graph-view/graph-view.module';

@NgModule({
    declarations: [WindowManagerComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ScreenSizeModule,
        QuickControlsViewModule,
        GraphViewModule,
        StoreModule.forFeature('windowManagement', windowManagementReducer.reducer),
    ],
    exports: [WindowManagerComponent],
})
export class WindowManagerModule {}
