import { NestedTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, takeUntil } from 'rxjs';
import { NodeSearchEffects } from 'src/app/modules/graph-renderer/effects/node-search.effects';
import { TreeDataServiceService } from '../../services/tree-data-service.service';

export interface KeyValueNode {
    key: string;
    value?: string;
    children?: KeyValueNode[];
}

@UntilDestroy()
@Component({
    selector: 'app-node-info',
    templateUrl: './node-info.component.html',
    styleUrls: ['./node-info.component.scss'],
})
export class NodeInfoComponent implements AfterViewInit {
    treeControl = new NestedTreeControl<KeyValueNode>((node) => node.children);
    dataSource = new MatTreeNestedDataSource<KeyValueNode>();

    constructor(
        public nodeSearchEffects: NodeSearchEffects,
        public treeDataServiceService: TreeDataServiceService,
        public cdr: ChangeDetectorRef,
    ) {}

    ngAfterViewInit(): void {
        this.treeDataServiceService.treeData$.pipe(untilDestroyed(this)).subscribe((data) => {
            this.dataSource.data = data;
            this.cdr.detectChanges();
        });
    }

    hasChild = (_: number, node: KeyValueNode) => !!node.children && node.children.length > 0;
}
