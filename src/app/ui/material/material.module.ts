import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MtxSliderModule } from '@ng-matero/extensions/slider';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MtxSplitModule } from '@ng-matero/extensions/split';
import { MtxPopoverModule } from '@ng-matero/extensions/popover';
import { MtxAlertModule } from '@ng-matero/extensions/alert';
import { MatTreeModule } from '@angular/material/tree';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    imports: [
        MatInputModule,
        MatCardModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatDividerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSelectModule,
        MatTooltipModule,
        MatSidenavModule,
        MtxSliderModule,
        ClipboardModule,
        MtxSplitModule,
        MtxPopoverModule,
        MtxAlertModule,
        MtxGridModule,
        MatTreeModule,
        ScrollingModule,
        RouterModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
    ],
    exports: [
        MatInputModule,
        MatCardModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatDividerModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSelectModule,
        MatTooltipModule,
        MatSidenavModule,
        MtxSliderModule,
        MtxSplitModule,
        MtxPopoverModule,
        MtxAlertModule,
        MtxGridModule,
        MatTreeModule,
        ScrollingModule,
        RouterModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
    ],
})
export class MaterialModule {
    constructor(private domSanitizer: DomSanitizer, private matIconRegistry: MatIconRegistry) {
        this.matIconRegistry.addSvgIcon(
            'lnvisualizer',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/lnvisualizer_fin.svg'),
        );
    }
}
