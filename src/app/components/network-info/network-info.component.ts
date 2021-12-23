import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { SceneComponent } from 'atft';
import { map, tap } from 'rxjs';
import { LndApiServiceService } from 'src/app/services/lnd-api-service.service';
import { NodePositionRegistryService } from 'src/app/services/node-position-registry.service';
import { LnGraph, LnGraphEdge, LnGraphNode } from 'src/app/types/graph.interface';

@Component({
  selector: 'app-network-info',
  templateUrl: './network-info.component.html',
  styleUrls: ['./network-info.component.scss']
})
export class NetworkInfoComponent implements AfterViewInit{

  @ViewChild(SceneComponent) scene!: SceneComponent;

  constructor(
    public lndApiServiceService: LndApiServiceService,
    protected nodePositionRegistryService: NodePositionRegistryService,
    private http: HttpClient
  ) { }

  public lol = this.http.get<LnGraph>('assets/graph.json')

  public nodeList: LnGraphNode[] = [];
  public edgeList: LnGraphEdge[] = [];

  public centralityScore: Record<string, number> = {};

  filterNodeView(g: LnGraph): LnGraph{
    const nodeView =   g.nodes.filter((n) => this.getNodeEdges(n, this.nodePositionRegistryService.nodeCentrality) ===1)
    return {
      nodes: nodeView,
      edges: g.edges.filter((e) => nodeView.some((a) => a.pub_key === e.node1_pub) && nodeView.some((a) => a.pub_key === e.node2_pub))//.slice(0,1000),
    } as LnGraph
  }

  ngAfterViewInit(){
    this.lol.pipe(
      map((g: LnGraph) => this.sortLnGraphByCentrality(g)),
      map((g: LnGraph) => this.filterNodeView(g)))
      .subscribe((x) => {
      this.nodeList = x.nodes; 
      this.edgeList = x.edges;
    })
  }

  precomputeNodeCentralizty(g: LnGraph): Record<string, number>{

    const t0 = performance.now();

    
    const centrality: Record<string, number> = {};

    g.edges.forEach(edge => {

      if (!centrality[edge.node1_pub]) centrality[edge.node1_pub] = 0;
      if (!centrality[edge.node2_pub]) centrality[edge.node2_pub] = 0;

      centrality[edge.node1_pub] += 1;
      centrality[edge.node2_pub] += 1;
    });

    const t1 = performance.now();
    console.log(`Call to compute centrality took ${t1 - t0} milliseconds.`);

    return centrality;
  }

  getNodeEdges(node: LnGraphNode, c: Record<string, number>): number{
    return c[node.pub_key];
  };

  sortLnGraphByCentrality(g: LnGraph){

    const c = this.precomputeNodeCentralizty(g);

    console.log('ZZZZAAAAMN')
    console.log(c)

    g.nodes = g.nodes.sort((a,b) => this.getNodeEdges(b, c) - this.getNodeEdges(a, c))

    console.log('dayim')
    console.log(g.nodes.map((n) => this.getNodeEdges(n, c)))

    this.nodePositionRegistryService.nodeCentrality = c;

    return g;
  }
}
