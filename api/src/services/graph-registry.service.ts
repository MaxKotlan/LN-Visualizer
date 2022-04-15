import { injectable } from 'inversify/lib/annotation/injectable';
import { GetNetworkGraphResult } from 'lightning';

@injectable()
export class GraphRegistryService {
    mapToRegistry(gstate: GetNetworkGraphResult) {
        gstate.nodes.forEach((node) => {
            this.nodeMap.set(node.public_key, node as any);
        });
        gstate.channels.forEach((channel) => {
            this.channelMap.set(channel.id, channel as any);
        });
    }

    public nodeMap: Map<
        string,
        {
            /** Name */
            alias: string;
            /** Hex Encoded Color */
            color: string;
            features: {
                /** BOLT 09 Feature Bit */
                bit: number;
                /** Feature is Known */
                is_known: boolean;
                /** Feature Support is Required */
                is_required: boolean;
                /** Feature Type */
                type: string;
            }[];
            /** Node Public Key */
            public_key: string;
            /** Network Addresses and Ports */
            sockets: string[];
            /** Last Updated ISO 8601 Date */
            updated_at: string;
            position: THREE.Vector3;
        }
    > = new Map();

    public channelMap: Map<
        string,
        {
            /** Channel Capacity Tokens */
            capacity: number;
            /** Standard Format Channel Id */
            id: string;
            policies: {
                /** Bae Fee Millitokens */
                base_fee_mtokens?: string;
                /** CLTV Height Delta */
                cltv_delta?: number;
                /** Fee Rate In Millitokens Per Million */
                fee_rate?: number;
                /** Edge is Disabled */
                is_disabled?: boolean;
                /** Maximum HTLC Millitokens */
                max_htlc_mtokens?: string;
                /** Minimum HTLC Millitokens */
                min_htlc_mtokens?: string;
                /** Public Key */
                public_key: string;
                /** Last Update Epoch ISO 8601 Date */
                updated_at?: string;
            }[];
            /** Funding Transaction Id */
            transaction_id: string;
            /** Funding Transaction Output Index */
            transaction_vout: number;
            /** Last Update Epoch ISO 8601 Date */
            updated_at?: string;
        }
    > = new Map();

    public nodesToArray() {
        return Array.from(this.nodeMap.values());
    }

    public channelsToArray() {
        return Array.from(this.channelMap.values());
    }
}
