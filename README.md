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
     lnvisweb:
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
    You can find the latest version by looking at this side panel

    ![image](https://user-images.githubusercontent.com/7473983/168476937-2274378e-6d0f-4968-b1df-14706f801dbf.png)

4.  Edit the environment section for the api in the `docker-compose.yml`
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
    alternatively, you can pass in the file location to your macaroon and cert directly.
    ```
     ...
     stop_grace_period: 1m
     environment:
    	LND_CERT_FILE: 'path to lnd.cert eg. /lnd/tls.cert'
    	LND_MACAROON_FILE: 'path to lnd.cert eg. /lnd/data/chain/bitcoin/mainnet/readonly.macaroon'
    	LND_SOCKET: umbrel.local:10009
    ```
    If you want to reference the file directly, you need to also mount a volume to the lnd folder to pass the files into the docker container.
    You can do this by adding this section to the `docker-compose.yml` file. The left side of the colon is the path on the host machine, the right side is the path in     the docker container. Make sure the environment var paths from the line above are from the perspective of the docker container.
    ```
    volumes:
      '/home/umbrel/umbrel/lnd:/lnd:ro'
    ```
    
    
5.  start the application running the following command
    ```
    docker-compose up -d
    ```

6.  connect to the application by going to
    if running on the same machine, connect by going to:
    [http://127.0.0.1:5646](http://127.0.0.1:5646)
    if running on umbrel, connect by going to:
    [http://umbrel.local:5646](http://umbrel.local:5646)

7.  stop the application by running the following command in the same folder with the `docker-compose.yml` file
    ```
    docker-compose down
    ```

## Umbrel App Store

Coming soon

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
