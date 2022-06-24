import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConnectedChannelsFilter } from './channel-filters/connected-channels.filter';
import { PolicyScriptFilter } from './channel-filters/policy-script.filter';

@NgModule({
    providers: [ConnectedChannelsFilter, PolicyScriptFilter],
    imports: [CommonModule],
})
export class FilterTemplatesModule {}
