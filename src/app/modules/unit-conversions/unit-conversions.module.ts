import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitPipe } from './pipes/unit.pipe';
import {
    FinalConverterWrapper,
    MilliSatLogInputConverterService,
    NumberLogInputConverterService,
    SatLogInputConverterService,
    UnitConverterService,
} from './service';

@NgModule({
    declarations: [UnitPipe],
    providers: [
        UnitPipe,
        UnitConverterService,
        MilliSatLogInputConverterService,
        NumberLogInputConverterService,
        SatLogInputConverterService,
        FinalConverterWrapper,
    ],
    imports: [CommonModule],
    exports: [UnitPipe],
})
export class UnitConversionsModule {}
