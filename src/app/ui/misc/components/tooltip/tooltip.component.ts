import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { matTooltipAnimations, _TooltipComponentBase } from '@angular/material/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { ToolTipService } from 'src/app/ui/misc/services/tooltip.service';

@Component({
    selector: 'app-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./tooltip.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [matTooltipAnimations.tooltipState],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        // Forces the element to have a layout in IE and Edge. This fixes issues where the element
        // won't be rendered if the animations are disabled or there is no web animations polyfill.
        '[style.zoom]': '_visibility === "visible" ? 1 : null',
        'aria-hidden': 'true',
    },
})
@UntilDestroy()
export class TooltipComponent extends _TooltipComponentBase {
    /** Stream that emits whether the user has a handset-sized display.  */
    _isHandset: Observable<BreakpointState> = this._breakpointObserver.observe(Breakpoints.Handset);

    constructor(
        changeDetectorRef: ChangeDetectorRef,
        private _breakpointObserver: BreakpointObserver,
        public toolTipService: ToolTipService,
    ) {
        super(changeDetectorRef);
        this.toolTipService.isOpened$
            .pipe(untilDestroyed(this))
            .subscribe((isopened) => (isopened ? this.show(0) : this.hide(0)));
        this.toolTipService.tooltipText$
            .pipe(untilDestroyed(this))
            .subscribe((message) => (this.message = message));
    }
}
