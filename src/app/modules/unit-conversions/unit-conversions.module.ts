import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitPipe } from './pipes/unit.pipe';

@NgModule({
    declarations: [UnitPipe],
    providers: [UnitPipe],
    imports: [CommonModule],
    exports: [UnitPipe],
})
export class UnitConversionsModule {}
