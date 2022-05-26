import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitPipe } from './pipes/unit.pipe';
import { UnitConverterService } from './service';

@NgModule({
    declarations: [UnitPipe],
    providers: [UnitPipe, UnitConverterService],
    imports: [CommonModule],
    exports: [UnitPipe],
})
export class UnitConversionsModule {}
