export interface smsRequestSchema {
    senderid:string;
    route:string;
    number:string;
    message:string;
    unicode?:number;
    time?:string;
    flash?:number;
}

export interface smsSettings {
    senderid?:string;
    route?:string;
}

export interface smsConfig {
    unicode?:number;
    flash?:number;
}