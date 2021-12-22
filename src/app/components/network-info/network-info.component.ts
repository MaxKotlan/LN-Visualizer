import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SceneComponent } from 'atft';
import { map } from 'rxjs';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';
import { LnGraph, LnGraphNode } from 'src/app/types/graph.interface';

@Component({
  selector: 'app-network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.scss']
})
export class NetworkInfoComponent implements AfterViewInit{

  @ViewChild(SceneComponent) scene!: SceneComponent;

  constructor(public lndApiServiceService: LndApiServiceService, private http: HttpClient) { }

  public lol = this.http.get<LnGraph>('assets/graph.json')

  public nodeList: LnGraphNode[] = [];

  ngAfterViewInit(){
    this.lol.pipe(map((g: LnGraph) => 
    ({
      nodes: g.nodes,//.slice(0,8000),
      edges: g.edges.slice(0,10),
    } as LnGraph))).subscribe((x) => {
      this.nodeList = x.nodes 
    })
  }
}
