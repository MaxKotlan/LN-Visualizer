# LNVisualizer

![example workflow](https://github.com/MaxKotlan/LN-Visualizer/actions/workflows/prod-build.yml/badge.svg)

LnVisualizer or Lightning Network Visualizer, is a graph visualization tool specifically made to draw the lightning network.

## Working Demo

Visit [lnvisualizer.com](http://lnvisualizer.com/) to see the network from my nodes perspective.

## Running with Docker Compose

1.  Install docker and docker-compose
2.  download the docker compose file
    ```
    wget https://raw.githubusercontent.com/MaxKotlan/LN-Visualizer/main/docker-compose.yml
    ```
3.  Update the version tag for both the api and the web

    If you are running this on an arm platform, such as a raspberry pi, using the `:latest` tag is not supported.
    You must specify a version directly eg..
    
    change the web version from:
   
       ```
        ...
        lnvisweb:
          image: maxkotlan/ln-visualizer-web:latest
          restart: on-failure
        ...
    ```
    
    to
    
    ```
        ...
        lnvisapi:
          image: maxkotlan/ln-visualizer-web:v0.0.17
          restart: on-failure
        ...
    ```
    
    and change the api image tag from
   
    ```
        ...
        lnvisapi:
          image: maxkotlan/ln-visualizer-api:latest
          restart: on-failure
        ...
    ```
    
    to
    
    ```
        ...
        lnvisapi:
          image: maxkotlan/ln-visualizer-api:v0.0.17
          restart: on-failure
        ...
    ```
    
    You can find the latest version by looking at this side pannel
![image](https://user-images.githubusercontent.com/7473983/168476937-2274378e-6d0f-4968-b1df-14706f801dbf.png)


5.  Edit the environment section for the api in the `docker-compose.yml`
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
5.  run using
    `docker compose up -d`

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
