export interface LndNode {
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
}
