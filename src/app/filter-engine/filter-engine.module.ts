import { NgModule } from '@angular/core';
import { ControlsGraphFilterModule } from './controls-graph-filter/controls-graph-filter.module';
import { FilterTemplatesModule } from './filter-templates/filter-templates.module';

@NgModule({
    imports: [ControlsGraphFilterModule, FilterTemplatesModule],
    exports: [ControlsGraphFilterModule, FilterTemplatesModule],
})
export class FilterEngineModule {}
