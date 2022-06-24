import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { MaterialModule } from '../material';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { FilterEffects } from './effects/filter.effects';
import { StoreModule } from '@ngrx/store';
import { filterReducer } from './reducer';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AddExpressionComponent } from './components/add-expression/add-expression.component';
import { filterViewReducer } from './reducer/filter-view.reducer';

@NgModule({
    declarations: [FilterListComponent, FilterModalComponent, AddExpressionComponent],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        CodemirrorModule,
        EffectsModule.forFeature([FilterEffects]),
        StoreModule.forFeature('graphFilterState', filterReducer),
        StoreModule.forFeature('filterViewState', filterViewReducer),
    ],
    exports: [FilterModalComponent],
})
export class ControlsGraphFilterModule {}
