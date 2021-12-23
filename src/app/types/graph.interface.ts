export interface LnGraph{
    nodes: LnGraphNode[],
    edges: LnGraphEdge[]
}

export interface LnGraphNode{
    pub_key: string
    color: string
}

export interface LnGraphEdge{
    node1_pub: string,
    node2_pub: string
}