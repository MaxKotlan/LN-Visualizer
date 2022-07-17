import { injectable } from 'inversify';
import { ConfigService } from './config.service';
import * as lightning from 'lightning';
import { LndChannel, LndNode } from '../models';
import { randomUUID } from 'crypto';

@injectable()
export class BenchmarkDataGeneratorService {
    constructor(private configService: ConfigService) {}

    public getRandomNode(state: lightning.GetNetworkGraphResult): LndNode {
        return state.nodes[Math.floor(Math.random() * state.nodes.length)];
    }

    public getNetworkGraph(): Promise<lightning.GetNetworkGraphResult> {
        const nodeCount = this.configService.getConfig().benchmarkMode.nodeCount;
        const channelCount = this.configService.getConfig().benchmarkMode.channelCount;

        console.log(`Benchmarking ${nodeCount} nodes and ${channelCount} channels`);

        let result: lightning.GetNetworkGraphResult = {
            nodes: [],
            channels: [],
        } as lightning.GetNetworkGraphResult;

        for (let i = 0; i < nodeCount; i++) {
            result.nodes.push({
                alias: randomUUID(),
                public_key: randomUUID(),
                color: '#' + (((1 << 24) * Math.random()) | 0).toString(16),
                features: [],
                sockets: [],
            } as any as LndNode);
        }

        for (let i = 0; i < channelCount; i++) {
            result.channels.push({
                id: randomUUID(),
                capacity: Math.floor(Math.random() * 1000000),
                policies: [
                    {
                        public_key: this.getRandomNode(result).public_key,
                    },
                    {
                        public_key: this.getRandomNode(result).public_key,
                    },
                ],
            } as LndChannel);
        }

        return Promise.resolve(result);
    }
}
