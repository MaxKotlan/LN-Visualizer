'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('graph.json');
let graph = JSON.parse(rawdata);
const minData = {
    nodes: graph.nodes.map((n) => ({
        pub_key: n.pub_key,
        alias: n.alias,
        color: n.color
    })),
    edges: graph.edges.map((e) => ({
        node1_pub: e.node1_pub,
        node2_pub: e.node2_pub,
        capacity: e.capacity
    }))
};

fs.writeFileSync('graph-min.json', JSON.stringify(minData));