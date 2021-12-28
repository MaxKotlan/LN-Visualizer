console.log('testing');
import express from "express";
import config from 'config';
import * as lightning from 'lightning';
import { LndAuthenticationWithMacaroon } from "lightning";
import cors from "cors";
import { WebSocket, WebSocketServer } from 'ws';
import { BehaviorSubject, filter, firstValueFrom, lastValueFrom, startWith, take } from 'rxjs';

const wss = new WebSocketServer({ port: 8090 });

const lnService = require('ln-service');

console.log(config.get('macaroon'))

const macaroonFromConfig: LndAuthenticationWithMacaroon = config.get('macaroon');
const {lnd} = lightning.authenticatedLndGrpc(macaroonFromConfig);
  
const app = express();
app.use(cors());

let networkGraphSubject$: BehaviorSubject<any> = new BehaviorSubject({});

const requestAndUpdateNetworkGraph = async () => {
    const result = await lnService.getNetworkGraph({lnd});
    networkGraphSubject$.next(result);
    return result;
}

const mapToFilteredView = (result: any) => {
    return {
        nodes: result.nodes.map((node: any) => 
        ({
            pub_key: node.public_key,
            alias: node.alias,
            color: node.color

        })),
        edges: result.channels.map((edge: any, index: any) => {
            if (!edge?.policies[0]?.public_key || !edge?.policies[1]?.public_key) console.log('Public key missing');
            return {
                node1_pub: edge.policies[0].public_key,
                node2_pub: edge.policies[1].public_key,
                capacity: edge.capacity
            }
        })
    }
}

app.get( "/", async ( req: any, res: any ) => {
    const cached = await lastValueFrom(networkGraphSubject$.asObservable().pipe(take(1)))
    if (!cached?.nodes?.length){
        console.log('Requesting new');
        let request = await requestAndUpdateNetworkGraph();
        const filteredView = mapToFilteredView(request);
        console.log(filteredView.edges.length);
        console.log(filteredView.nodes.length);
        res.send(JSON.stringify(filteredView));
    } else {
        console.log('Using Cached');
        const filteredView = mapToFilteredView(cached);
        console.log(filteredView.edges.length);
        console.log(filteredView.nodes.length);
        res.send(JSON.stringify(filteredView));
    }
} );

// start the Express server
app.listen( config.get('port'), () => {
    console.log( `server started at http://localhost:${ config.get('port') }` );
});


networkGraphSubject$.asObservable().subscribe((newValue) => {
    console.log('state updated', newValue)
    wss.emit('graph-update', wss.clients, JSON.stringify(newValue));
});

wss.on('graph-update', function connection(wsClients: Set<WebSocket>, message) {
    wsClients.forEach((w) => {
        console.log('broadcating to ', w)
        w.send(message)
    })
});

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });

    ws.on('graph-update', function connection(ws, message) {
        ws.send(message)
    });

    ws.send('something');
});