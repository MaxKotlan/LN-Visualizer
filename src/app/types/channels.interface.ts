export interface LndChannel {
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
