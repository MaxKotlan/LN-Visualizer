console.log('testing');
import express from "express";
// import dotenv from 'dotenv';
import * as lightning from 'lightning';
import fs from 'fs';
import { LndAuthenticationWithMacaroon } from "lightning";
import cors from "cors";
import { WebSocketServer } from 'ws';
import { BehaviorSubject, lastValueFrom, take } from 'rxjs';

const wss = new WebSocketServer({ port: 8090 });

const lnService = require('ln-service');

console.log('about to load from', process.env.LND_DATA_DIR);
console.log('and connect to', process.env.LND_ADDRESS)


let base64cert = process.env.LND_CERT_FILE || '';
let macaroon = process.env.LND_VIEW_MACAROON_FILE || '';

let why = {};
if (base64cert === ''){
    // base64cert = config.get('macaroon.cert');
    // macaroon = config.get('macaroon.macaroon');
    // why = {
    //     cert: base64cert,
    //     macaroon: macaroon,
    //     socket: config.get('macaroon.socket')
    // }
    console.log('missing envs');
} else {
    why = {
        cert: fs.readFileSync(base64cert, {encoding: 'base64'}),
        macaroon: fs.readFileSync(macaroon, {encoding: 'base64'}),
        socket: process.env.LND_ADDRESS
    }
}


console.log(why)

//const macaroonFromConfig: LndAuthenticationWithMacaroon = config.get('macaroon');
const {lnd} = lightning.authenticatedLndGrpc(why);
  
const app = express();
//app.use((cors as any)());

let networkGraphSubject$: BehaviorSubject<any> = new BehaviorSubject({});

const requestAndUpdateNetworkGraph = async () => {
    console.log('requesting update...')
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
    try{
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
            requestAndUpdateNetworkGraph();
            const filteredView = mapToFilteredView(cached);
            console.log(filteredView.edges.length);
            console.log(filteredView.nodes.length);
            res.send(JSON.stringify(filteredView));
        }
    } catch(e) {
        res.send(503, JSON.stringify(e))
    };
});

// start the Express server
app.listen( 8080, () => {
    console.log( `server started at http://localhost:${ 8080 }` );
});

networkGraphSubject$.asObservable().subscribe((newValue) => {
    console.log('state updated', newValue)
    wss.emit('graph-update', JSON.stringify(newValue));
});

// wss.on('graph-update', function connection(wsClients: Set<WebSocket>, message) {
//     wsClients.forEach((w) => {
//         console.log('broadcating to ', w)
//         w.send(message)
//     })
// });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });

    ws.on('graph-update', function connection(ws, message) {
        ws.send(message)
    });

    ws.send('something');
});