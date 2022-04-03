export interface Alert {
    id: string;
    type: 'default' | 'info' | 'success' | 'warning' | 'danger';
    message: string;
}
