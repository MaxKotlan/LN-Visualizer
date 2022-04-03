export interface Alert {
    type: 'default' | 'info' | 'success' | 'warning' | 'danger';
    message: string;
}
