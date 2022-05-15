# LNVisualizer

![example workflow](https://github.com/MaxKotlan/LN-Visualizer/actions/workflows/prod-build.yml/badge.svg)

LnVisualizer or Lightning Network Visualizer, is a graph visualization tool specifically made to draw the lightning network.

## Working Demo

Visit [lnvisualizer.com](http://lnvisualizer.com/) to see the network from my nodes perspective.

## Running with Docker Compose

1.  Install docker and docker-compose
2.  download the docker compose file
    `wget https://github.com/MaxKotlan/LN-Visualizer/blob/main/docker-compose.yml`
3.  Edit the environment section for the api in the `docker-compose.yml`
    You can pass in base64 encoded credentials as environment variables.
    To get base64 credentials see https://github.com/alexbosworth/lightning#lnd-authentication for instructions on how to convert `tls.cert` and `readonly.macaroon` into base64.
    ```
    ...
    stop_grace_period: 1m
    environment:
    	LND_CERT: 'your base64 lnd tls certificate'
    	LND_MACAROON: 'your base64 readonly macaroon'
    	LND_SOCKET: 'ip address and port eg. umbrel.local:10009 or 127.0.0.1:10009'
    ```
    alternatively, you can pass in the file location to your macaroon and cert directly
    ```
     ...
     stop_grace_period: 1m
     environment:
    	LND_CERT_FILE: 'path to lnd.cert eg. ~/umbrel/lnd/tls.cert'
    	LND_MACAROON_FILE: 'path to lnd.cert eg. ~/umbrel/lnd/data/chain/bitcoin/mainnet/readonly.macaroon'
    	LND_SOCKET: umbrel.local:10009
    ```
4.  run using
    `docker compose up -d`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
