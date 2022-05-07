import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as windowManagementReducer from './reducers';
import { WindowManagerComponent } from './components/window-manager/window-manager.component';
import { MaterialModule } from '../material';
import { ScreenSizeModule } from '../screen-size/screen-size.module';
import { QuickControlsViewModule } from '../quick-controls-view/quick-controls-view.module';
import { GraphViewModule } from '../graph-view/graph-view.module';
import { EffectsModule } from '@ngrx/effects';
import { WindowManagerEffects } from './effects';
import { ControlsGraphFilterModule } from '../controls-graph-filter/controls-graph-filter.module';
import { NodeInfoModule } from '../node-info/node-info.module';

@NgModule({
    declarations: [WindowManagerComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ScreenSizeModule,
        QuickControlsViewModule,
        ControlsGraphFilterModule,
        GraphViewModule,
        NodeInfoModule,
        EffectsModule.forFeature([WindowManagerEffects]),
        StoreModule.forFeature('windowManagement', windowManagementReducer.reducer),
    ],
    exports: [WindowManagerComponent],
})
export class WindowManagerModule {}
