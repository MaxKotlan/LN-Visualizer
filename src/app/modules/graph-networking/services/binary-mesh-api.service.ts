import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { take, skip } from 'rxjs';
import { NodeBuffersService } from 'src/app/renderer/graph-renderer/services/node-buffers/node-buffers.service';
import { meshScale } from 'src/app/constants/mesh-scale.constant';

export type Command = string;

@Injectable()
export class BinaryMeshApiService {
    private subject: WebSocketSubject<any>;

    constructor(private nodeBufferService: NodeBuffersService) {}

    public createWsSubject() {
        if (environment.production) {
            this.subject = webSocket(
                `${location.origin.replace('http://', 'ws://').replace('https://', 'wss://')}/api/`,
            );
        } else {
            this.subject = webSocket({
                url: `ws://127.0.0.1:5647`,
                binaryType: 'arraybuffer',
                deserializer: (msg) => msg,
            });
        }
    }

    public getNodePositions() {
        this.createWsSubject();
        this.subject.next('binNodePos');
        this.subject
            .asObservable()
            .pipe(skip(1), take(1))
            .subscribe((a) => {
                const b = new Float32Array(a.data).map((x) => x * meshScale);
                this.nodeBufferService.vertex.size = b.length;
                this.nodeBufferService.vertex.data = b;
                this.nodeBufferService.vertex.onUpdate.next(b.length);
                console.log(this.nodeBufferService.vertex.data);

                // this.nodeBufferService.vertex.onUpdate.next(b.length);
                // console.log(this.nodeBufferService.vertex.data.length);
                // this.nodeBufferService.vertex.data.forEach((x, i) => {
                //     x = b[i];
                // });
                // console.log(this.nodeBufferService.vertex.data);
                // this.nodeBufferService.vertex.size = b.length;
                //this.nodeBufferService.vertex.size = b.length;
            });
    }

    public getChannelBuffer() {
        this.createWsSubject();
        this.subject.next('binChannelPos');
        this.subject
            .asObservable()
            .pipe(skip(1), take(1))
            .subscribe((a) => {
                // this.nodeBufferService.vertex.data.forEach(byte => {

                // })
                // this.nodeBufferService.vertex.data[]

                console.log();
            });
    }
}
