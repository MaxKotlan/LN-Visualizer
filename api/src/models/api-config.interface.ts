import { LndAuthenticationWithMacaroon } from 'lightning';

export interface ApiConfig {
    macaroon: LndAuthenticationWithMacaroon;
    port: string;
}
