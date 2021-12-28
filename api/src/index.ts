console.log('testing');
import express from "express";
import config from 'config';
import * as lightning from 'lightning';
import { LndAuthenticationWithMacaroon } from "lightning";
import cors from "cors";
const lnService = require('ln-service');

console.log(config.get('macaroon'))


const macaroonFromConfig: LndAuthenticationWithMacaroon = config.get('macaroon');
const {lnd} = lightning.authenticatedLndGrpc(macaroonFromConfig);
  
const app = express();
app.use(cors());
let counter = 0;

app.get( "/", async ( req: any, res: any ) => {
    const {channels, nodes} = await lnService.getNetworkGraph({lnd});

    const filteredView = {
        nodes: nodes.map((node: any) => 
        ({
            pub_key: node.public_key,
            alias: node.alias,
            color: node.color

        })),
        edges: channels.map((edge: any, index: any) => {
            if (index%1000 === 0) console.log(edge);
            return {
                node1_pub: edge.policies[0].public_key,
                node2_pub: edge.policies[1].public_key,
                capacity: edge.capacity
            }
        })
    }

    //const mapper = {}
    console.log('reques')
    res.send(JSON.stringify(filteredView));//await lnService.getWalletInfo({lnd}))
    //res.send( "Hello world!" + counter++ );
} );

// start the Express server
app.listen( config.get('port'), () => {
    console.log( `server started at http://localhost:${ config.get('port') }` );
});
