import { NgModule } from '@angular/core';
import { WindowManagerModule } from './window-manager/window-manager.module';

@NgModule({
    imports: [WindowManagerModule],
    exports: [WindowManagerModule],
})
export class UiModule {}
