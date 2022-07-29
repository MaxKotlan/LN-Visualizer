import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { GraphDatabaseEffects } from './effects';
import { GraphDatabaseService } from './services';

@NgModule({
    imports: [EffectsModule.forFeature([GraphDatabaseEffects])],
    providers: [GraphDatabaseService],
})
export class GraphIndexdbModule {}
