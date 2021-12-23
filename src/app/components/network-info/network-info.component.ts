import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SceneComponent } from 'atft';
import { map, tap } from 'rxjs';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';
import { LnGraph, LnGraphEdge, LnGraphNode } from 'src/app/types/graph.interface';

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
  public edgeList: LnGraphEdge[] = [];

  public centralityScore: Record<string, number> = {};

  ngAfterViewInit(){
    this.lol.pipe(
      tap(this.precomputeNodeCentralizty),
      map((g: LnGraph) => this.sortLnGraphByCentrality(g)),
      map((g: LnGraph) => 
    ({
      nodes: g.nodes,//.slice(0,8000),
      edges: g.edges//.slice(0,1000),
    } as LnGraph))).subscribe((x) => {
      this.nodeList = x.nodes; 
      this.edgeList = x.edges;
    })
  }

  precomputeNodeCentralizty(g: LnGraph){
    g.edges.forEach(edge => {
      if (!this.centralityScore[edge.node1_pub]) this.centralityScore[edge.node1_pub] = 0;
      if (!this.centralityScore[edge.node2_pub]) this.centralityScore[edge.node2_pub] = 0;

      this.centralityScore[edge.node1_pub] += 1;
      this.centralityScore[edge.node2_pub] += 1;
    });
  }

  getNodeEdges(node: LnGraphNode): number{
    return (this.centralityScore[node.pub_key] / 2);
  };

  sortLnGraphByCentrality(g: LnGraph){

    g.nodes.sort((a,b) => this.getNodeEdges(b) - this.getNodeEdges(a))

    return g;
  }
}
