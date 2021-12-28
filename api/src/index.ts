const lnService = require('ln-service');
console.log('testing');
import express from "express";
import config from 'config';
import * as lightning from 'lightning';
import { LndAuthenticationWithMacaroon } from "lightning";

console.log(config.get('macaroon'))


const macaroonFromConfig: LndAuthenticationWithMacaroon = config.get('macaroon');
const {lnd} = lightning.authenticatedLndGrpc(macaroonFromConfig);
  
const app = express();
let counter = 0;

app.get( "/", ( req: any, res: any ) => {
    res.send( "Hello world!" + counter++ );
} );

// start the Express server
app.listen( config.get('port'), () => {
    console.log( `server started at http://localhost:${ config.get('port') }` );
} );
