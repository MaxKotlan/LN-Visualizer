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
    ],
})
export class MaterialModule {}
