import * as config from "../../config.json"
import { voiceRequestSchema, voiceSettings, voiceConfig, scheduleVoice, changeVoiceSchedule} from "./index.interface";
import axios, {AxiosInstance} from "axios"

export default class Voice {
    apiKey:String
    defaults:voiceRequestSchema
    requestData:voiceRequestSchema
    http:AxiosInstance;

    
    constructor(apiKey?:String) {
        
        this.apiKey = apiKey || process.env.SAINO_API_KEY

        
        this.defaults = {
            text:undefined,
            audio_file_url:undefined,
            config:undefined,
            timezone:undefined,
            send_at:undefined,

            //only this options will be available to be set as default
            subscription_id:undefined,
            maxLengthOfCall: undefined,
            speech_rate:undefined,
            language_id:undefined,

            is_text:undefined,
            numbers:undefined
        }

        this.requestData = this.defaults;

        this.http = axios.create({
            baseURL: config.baseURL,
            headers: {'Authorization': this.apiKey, 'content-type': 'application/json'}
          });

       

    }

    setDefaults(options:voiceSettings) {
        this.defaults = {...this.defaults, ...options}
        this.requestData = {...this.requestData,...options}

    }

    prepare(voiceRequestSchema: voiceRequestSchema){
        
        this.requestData = {...this.defaults, ...voiceRequestSchema}

        return this;
    }

    text(text:string) {
      
        this.requestData = {...this.requestData,text:text, is_text:true}
        return this;
    }

    audio(audioFileUrl:string) {
       
        this.requestData = {...this.requestData,audio_file_url:audioFileUrl, is_text:false}
        return this;
    }

    set(options:voiceSettings) {
        this.requestData = {...this.requestData,...options}
        return this
    }

    config(options:voiceConfig) {
        this.requestData = {...this.requestData, config:options}
        return this;
    }

    schedule(options:scheduleVoice){
        if(new RegExp("[0-9][0-9][0-9][0-9]/[0-1][0-9]/[0-3][0-9]\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]").test(options.send_at) !== true) throw new Error("please enter time in proper format (YYYY/MM/DD HH:MM:SS)")

        this.requestData = {...this.requestData, ...options}
        return this;
    }

    numbers(numbers:Array<string>) {
        this.requestData= {...this.requestData, numbers:numbers}
        return this
    }

    reschedule(options:changeVoiceSchedule) {

        if(options.voice_id === undefined) throw new Error("voice_id not defined")
        if(options.new_send_at === undefined) throw new Error("new_send_at not defined")
        if(options.timezone === undefined) throw new Error("timezone not defined")

        if(typeof options.voice_id !== "number") throw new Error("voice_id must be of type number")
        if(typeof options.new_send_at !== "string") throw new Error("new_send_at must be of type string")
        if(typeof options.timezone !== "string") throw new Error("timezone must be of type string")

        if(options.new_send_at.trim() === "") throw new Error("new_send_at must not be empty string")
        if(options.timezone.trim() === "") throw new Error("timezone must not be empty string")

        if(new RegExp("[0-9][0-9][0-9][0-9]/[0-1][0-9]/[0-3][0-9]\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]").test(options.new_send_at) !== true) throw new Error("please enter time in proper format (YYYY/MM/DD HH:MM:SS)")


        return new Promise((resolve, reject)=>{
        this.http.request({
            url:config.endpoints["bulk-voice/reschedule"],
            method:'PUT',
            data: {...options, new_send_at: new Date(options.new_send_at).getTime()}
        }).then(r=>{
            resolve(r.data)
        }).catch(e=>{
            reject(e.response.data)
        })
      })
    }

    cancel(voice_id:number) {
        if(typeof voice_id !== "number") throw new Error("voice_id must be of type number")

        return new Promise((resolve, reject)=>{
            this.http.request({
                url:config.endpoints["bulk-voice/cancelScheduled"] + "/" + voice_id,
                method:'DELETE',
            }).then(r=>{
                resolve(r.data)
            }).catch(e=>{
                reject(e.response.data)
            })
          })

    }

    send() {

        if(this.validation()) {
            return new Promise((resolve, reject)=>{

                this.http.request({
                    url:config.endpoints["bulk-voice"],
                    method:'POST',
                    data: this.requestData
                }).then(r=>{
                    this.requestData = this.defaults
                    resolve(r.data)
                }).catch(e=>{
                    reject(e.response.data)
                })
    
            }) 
           
           
        }
       
    }

   validation() {

        if (this.requestData.subscription_id === undefined) throw new Error("'subscription_id' is not defined")
        if (typeof this.requestData.subscription_id !== "number") throw new Error("'subsscription_id' should be of type number")

        if (this.requestData.maxLengthOfCall === undefined) throw new Error("'maxLengthOfCall' is not defined")
        if (typeof this.requestData.maxLengthOfCall !== "number") throw new Error("'maxLengthOfCall' should be of type number")

        if (this.requestData.is_text === undefined) throw new Error("'is_text' is not defined")
        if (typeof this.requestData.is_text !== "boolean") throw new Error("'is_text' value should be boolean")

        if (this.requestData.numbers === undefined) throw new Error("'numbers' are not defined")
        if (this.requestData.numbers instanceof Array !== true) throw new Error("'numbers' should be an Array")

        if(this.requestData.numbers !== undefined) {
            if(this.requestData.numbers.length === 0) throw Error("'numbers' array cannot be empty" )
            this.requestData.numbers.forEach(number => {
                if(typeof number !== "string") throw Error("elements of numbers array must be string")
                if(number.trim() === "") throw Error("numbers array should not have empty strings")

            });
        }
        
      
       if(this.requestData.send_at !== undefined  ){
       
        if(typeof this.requestData.send_at !== "string") throw new Error("time should be a string")
        if(this.requestData.send_at.trim() === "") throw new Error("time should not be a empty string")
        if(new RegExp("[0-9][0-9][0-9][0-9]/[0-1][0-9]/[0-3][0-9]\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]").test(this.requestData.send_at) !== true) throw new Error("please enter time in proper format (YYYY/MM/DD HH:MM:SS)")
        this.requestData.send_at = new Date(this.requestData.send_at).getTime()

        if(this.requestData.timezone === undefined) throw new Error("you must provide a timezone while scheduling a call")
        if(typeof this.requestData.timezone !== "string" ) throw new Error("timezone must be a string")
        if(this.requestData.timezone.trim() === "" ) throw new Error("timezone must not be an empty string")




    } 



       if(this.requestData.config !== undefined) {
           if(this.requestData.config.repeat !== undefined && typeof this.requestData.config.repeat !== "number") throw new Error("repeat must be a number") 
           if( this.requestData.config.callTransfer !== undefined) {
               if(this.requestData.config.callTransfer.transferKey === undefined) throw new Error("transferKey must be defined")
               if(typeof this.requestData.config.callTransfer.transferKey !== "number") throw new Error("transferKey must be a number")

               if(this.requestData.config.callTransfer.transferNumber === undefined) throw new Error("transferNumber must be defined")
               if(typeof this.requestData.config.callTransfer.transferNumber !== "number") throw new Error("transferNumber must be a number")

           }

           if (this.requestData.config.repeat === undefined && this.requestData.config.callTransfer === undefined) this.requestData.config = undefined
       }


        switch (this.requestData.is_text) {
            case true:

                if (this.requestData.text === undefined) throw new Error("text field cannot be undefined while sending a text to speech voice call")
                if (typeof this.requestData.text !== "string" ) throw new Error("text field should be of type string")
                if (this.requestData.text.trim() === "" ) throw new Error("text field should not be empty string")

                if (this.requestData.speech_rate === undefined) throw new Error("'speech_rate' is not defined")
                if (typeof this.requestData.speech_rate !== "number") throw new Error("'speech_rate' should be of type number")

                if (this.requestData.language_id === undefined) throw new Error("'language_id' is not defined")
                if (typeof this.requestData.language_id !== "number") throw new Error("'language_id' should be of type number")

                
               
                break;
            case false:

                if (this.requestData.audio_file_url === undefined) throw new Error("audio_file_url field cannot be undefined while sending a text to speech voice call")
                if (typeof this.requestData.audio_file_url !== "string" ) throw new Error("audio_file_url field should be of type string")
                if (this.requestData.audio_file_url.trim() === "" ) throw new Error("audio_file_url field should not be empty string")

               
                this.http.request({
                        url:this.requestData.audio_file_url,
                        method:'HEAD',
                    }).catch(e=>{
                        throw Error("audio not found at audio_file_url")
                    }) 
                
               
               
                break;

           
       }

       return true
    }

}

// const voice = new Voice()

// voice.setDefaults({
//     // subscription_id:2232, 
//     // maxLengthOfCall:8,
//     speech_rate: 1,
//     language_id:1
// })

// // voice.text("hello test")
// //         .numbers([])
// //         .send()

// voice.audio("url").numbers(["8698311236"]).set({subscription_id:2232, 
//     maxLengthOfCall:8,}).send()
//     .then(r=>{
//         console.log(r)
//     }).catch(e=>{
//         console.log(e)
//     })