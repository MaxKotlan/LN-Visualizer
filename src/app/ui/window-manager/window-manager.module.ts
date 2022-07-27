import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FilterEngineModule } from 'src/app/filter-engine/filter-engine.module';
import { GraphViewModule } from '../graph-view/graph-view.module';
import { MaterialModule } from '../material';
import { MiscModule } from '../misc/misc.module';
import { NodeInfoModule } from '../node-info/node-info.module';
import { QuickControlsViewModule } from '../quick-controls-view/quick-controls-view.module';
import { ScreenSizeModule } from '../screen-size/screen-size.module';
import { WindowManagerComponent } from './components/window-manager/window-manager.component';
import { WindowManagerEffects } from './effects';
import * as windowManagementReducer from './reducers';

@NgModule({
    declarations: [WindowManagerComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ScreenSizeModule,
        QuickControlsViewModule,
        GraphViewModule,
        NodeInfoModule,
        MiscModule,
        FilterEngineModule,
        EffectsModule.forFeature([WindowManagerEffects]),
        StoreModule.forFeature('windowManagement', windowManagementReducer.reducer),
    ],
    exports: [WindowManagerComponent],
})
export class WindowManagerModule {}
