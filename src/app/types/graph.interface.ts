
export interface LnGraph{
    nodes: LnGraphNode[],
    edges: LnGraphEdge[]
}

export interface LnGraphNode{
    pub_key: string
    alias: string
    color: string
}

export interface LnGraphEdge{
    node1_pub: string,
    node2_pub: string
    capacity: string
}


export interface LnModifiedGraphNode extends LnGraphNode{
    postition: THREE.Vector3,
    connectedEdges: LnGraphEdge[]
    parent: LnModifiedGraphNode;
    children: LnModifiedGraphNode[]
}