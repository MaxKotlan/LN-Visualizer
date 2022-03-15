export interface Filter {
    interpreter: 'lnscript' | 'javascript';
    source?: string;
    function?: Function;
    expression?: string[];
    issueId?: string | undefined;
}
