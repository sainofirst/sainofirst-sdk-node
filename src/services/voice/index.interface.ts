


export interface voiceRequestSchema {

    text?:string;
    audio_file_url?:string;

    config?:voiceConfig

    timezone?:string;
    send_at?:string|number;

    subscription_id:number;
    maxLengthOfCall: number;
    speech_rate?:number;
    language_id?:number;

    is_text:boolean;
    numbers:Array<string>;

}

export interface voiceConfig {
 
        repeat?:number
        callTransfer?: {
            transferKey:number;
            transferNumber:number;
        }
    
}

export interface voiceSettings {
    subscription_id?:number;
    maxLengthOfCall?: number;
    speech_rate?:number;
    language_id?:number;
}

export interface scheduleVoice {
    send_at: string;
    timezone: string;

}

export interface changeVoiceSchedule {
    voice_id: number;
    new_send_at: string;
    timezone: string;
}


