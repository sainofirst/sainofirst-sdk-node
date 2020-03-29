import * as config from "../../config.json"
import * as errors from "../../errors.json"
import axios, {AxiosInstance} from "axios"
/**
 *  Programmatically send voice calls globally. Build conversations anywhere and everywhere. Make calls around the world. 
    Your users can get OTP, alerts and much more all over a message.
 */
export default class Voice {
   /**
     * Sainofirst api key
     */
    private __apiKey:String
    
    /**
     * request data
     */
    private __requestData: any
    
    private __http: AxiosInstance;
   
    constructor(apiKey?:String){
        
        // if environment variable is set it will have that value if not then it will have api key provided via constructor
        this.__apiKey =  apiKey || process.env.SAINOFIRST_API_KEY 
       
 
        this.__requestData = {}

        this.__http = axios.create({
            baseURL: config.baseURL,
            headers: {'Authorization': this.__apiKey, 'content-type': 'application/json'}
          });

        if(this.__apiKey === undefined )  throw Error(errors["SFV001"])
        if(typeof this.__apiKey !== "string") throw Error(errors["SFT001"])
        if(this.__apiKey.trim() === "") throw Error(errors["SFV002"])
        

    }   

    /**
     * Returns request dictionary from voice service
     * @return Object
     */
    get() {
        return this.__requestData
    }

    /**
     *  Sets configuration options for voice service
     * @param options 
     */
    set(options:{subscription_id: Number, maxLengthOfCall: Number, speech_rate? : Number, language_id? : Number, config?: Object  }) {
            // raise if type of options parameter is not dictionary
            if (typeof options != 'object') {
                throw Error(errors['SFT002'])
            }

            if ("subscription_id" in options) {
                this.__requestData = {...this.__requestData, "subscription_id":options['subscription_id']}
            }

            if ("maxLengthOfCall" in options) {
            this.__requestData = {...this.__requestData, "maxLengthOfCall":options['maxLengthOfCall']}

            }

             if ("speech_rate" in options) {
            this.__requestData = {...this.__requestData, "speech_rate":options['speech_rate']}

             }

            if ("language_id" in options) {
            this.__requestData = {...this.__requestData, "language_id":options['language_id']}  

            }

            if ("config" in options) {
            this.__requestData = {...this.__requestData, "config" : options['config']  }

            }
        
        return this
    }

    /**
     *  Makes text synthesized call
     * @param text text to be synthesized for voice call
     */
    text(text:string) {
        this.__requestData = {...this.__requestData,text:text, is_text:true}
        return this;
    }

    /**
     *  Makes audio call
     * @param audioFileUrl url of the audio file
     */
    audio(audioFileUrl:string) {
        this.__requestData = {...this.__requestData,audio_file_url:audioFileUrl, is_text:false}
        return this;
    }

    /**
     * Set the list of  numbers for making a voice call
     * @param numbers array of numbers you want your voice call to be delivered to
     */
    numbers(numbers:Array<string>) {
        this.__requestData= {...this.__requestData, numbers:numbers}
        return this
    }

    /**
     * Schedules a voice call
     * @param time  Schedule time (in format i.e, yyyy-mm-dd hh:mm:ss) at which the voice call to be made
     * @param timezone timezone for the time
     */
    schedule(time:string, timezone:string){
        this.__requestData = {...this.__requestData, time:time, timezone:timezone}
        return this;
    }

    /**
     * Reschedules voice call
     * @param options 
     * @param callback 
     */
    reschedule(options: {voice_id: number, new_send_at: any, timezone: string}, callback?:Function) {

        if (typeof options !== "object")
            throw Error(errors['SFT002'])

        if(options.voice_id === undefined) throw new Error(errors["SFV032"])
        if(options.new_send_at === undefined) throw new Error(errors["SFV033"])
        if(options.timezone === undefined) throw new Error(errors["SFV034"])

        if(typeof options.voice_id !== "number") throw new Error(errors["SFT030"])
        if(typeof options.new_send_at !== "string") throw new Error(errors["SFT031"])
        if(typeof options.timezone !== "string") throw new Error(errors["SFT020"])

        if(options.new_send_at.trim() === "") throw new Error(errors["SFT032"])
       
        if(options.timezone.trim() === "") throw new Error(errors["SFV021"])

        if(new RegExp("[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]").test(options.new_send_at) !== true) 
            throw new Error(errors['SFV035'])

        options.new_send_at = new Date(options.new_send_at).getTime()

        if(typeof callback === "function") {
            this.__http.request({
                url:config.endpoints["bulk-voice/reschedule"],
                method:'PUT',
                data: options
            }).then(r=>{
               callback(r.data, null)
            }).catch(e=>{
                callback(null,e.response.data)
            })
        } else {
            return new Promise((resolve, reject)=>{
                this.__http.request({
                    url:config.endpoints["bulk-voice/reschedule"],
                    method:'PUT',
                    data: options
                }).then(r=>{
                    resolve(r.data)
                }).catch(e=>{
                    reject(e.response.data)
                })
              })
        }

    }

    /**
     * Cancels scheduled voice call
     * @param voice_id  voice id of the scheduled call
     * @param callback function to be executed after recieving response 
     */
    cancel(voice_id:number, callback?:Function) {
        if(typeof voice_id !== "number") throw new Error(errors["SFT030"])

        if(typeof callback === "function") {
            this.__http.request({
                url:config.endpoints["bulk-voice/cancelScheduled"] + "/" + voice_id,
                method:'DELETE',
            }).then(r=>{
                callback(r.data, null)
            }).catch(e=>{
                callback(null,e.response.data)
            })
        } else {
            return new Promise((resolve, reject)=>{
                this.__http.request({
                    url:config.endpoints["bulk-voice/cancelScheduled"] + "/" + voice_id,
                    method:'DELETE',
                }).then(r=>{
                    resolve(r.data)
                }).catch(e=>{
                    reject(e.response.data)
                })
              })
        }


    }

      /**
     * Sends voice call
     * 
     */
    send(...args: any[]) {

        
        let callbackExist = false
        let optionExist = false
        let callback: (r,e) => void
        
        // Check if the arguments exist
        if (args.length != 0) {

            if (typeof args[0] === 'object') {
                let options = args[0]
                optionExist = true
                this.__requestData = {...this.__requestData,...options}
            }
                
            
            if (typeof args[args.length -1] === 'function') {
                callback = args[args.length -1]
                callbackExist = true

            }

            //Exceptions
            if (args.length === 1){
                if (typeof args[0] != 'function' && typeof args[0] != 'object'){
                    throw Error(errors["SFT004"])
                }
                   
            }
                
            
            if (args.length === 2){
                if (typeof args[0] != 'object'){
                    throw Error(errors["SFT002"])
                }
                    
                if (typeof args[-1] !== 'function') {
                    throw Error(errors["SFT003"])
                }
                    
            }
            if (args.length > 2) {
                throw Error(errors["SFT005"])
            }
                
    }
        
    this.__validation()

    if(callbackExist) {

        this.__http.request({
            url:config.endpoints["bulk-voice"],
            method:'POST',
            data: this.__requestData
        }).then(r=>{
            this.__requestData = {}
            callback(r.data, null)
        }).catch(e=>{
            callback(null, e.response.data)
        })

        

    } else {
        return new Promise((resolve, reject)=>{

            this.__http.request({
                url:config.endpoints["bulk-voice"],
                method:'POST',
                data: this.__requestData
            }).then(r=>{
                this.__requestData = {}
                resolve(r.data)
            }).catch(e=>{
                reject(e.response.data)
            })

        }) 
    }
            

        
       
    }


    private __validation() {

        if (this.__requestData.subscription_id === undefined) throw new Error(errors["SFV012"])
        if (this.__requestData.maxLengthOfCall === undefined) throw new Error(errors["SFV013"])
        if (this.__requestData.is_text === undefined) throw new Error(errors["SFV014"])
        if (this.__requestData.numbers === undefined) throw new Error(errors["SFV015"])

        if (typeof this.__requestData.subscription_id !== "number") throw new Error(errors["SFT014"])
        if (typeof this.__requestData.maxLengthOfCall !== "number") throw new Error(errors["SFT015"])
        if (typeof this.__requestData.is_text !== "boolean") throw new Error(errors["SFT016"])
        if (this.__requestData.numbers instanceof Array !== true) throw new Error(errors["SFT017"])

        if(this.__requestData.numbers !== undefined) {
            if(this.__requestData.numbers.length === 0) throw Error(errors["SFV016"])
            
            this.__requestData.numbers.forEach(number => {
                if(typeof number !== "string") throw Error(errors["SFV017"])
                if(number.trim() === "") throw Error(errors["SFV018"])

            });
        }
        
      
       if(this.__requestData.send_at !== undefined  ){
       
        if(typeof this.__requestData.send_at !== "string") throw new Error(errors["SFT018"])
        if(this.__requestData.send_at.trim() === "") throw new Error(errors["SFT019"])
        
        if(new RegExp("[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]").test(this.__requestData.send_at) !== true) throw new Error(errors['SFV019'])
        this.__requestData.send_at = new Date(this.__requestData.send_at).getTime()

        if(this.__requestData.timezone === undefined) throw new Error(errors["SFV020"])
        if(typeof this.__requestData.timezone !== "string" ) throw new Error(errors["SFT020"])
        if(this.__requestData.timezone.trim() === "" ) throw new Error(errors["SFV021"])
    } 



       if(this.__requestData.config !== undefined) {

        if (typeof this.__requestData['config'] !== 'object')
                throw Error(errors['SFT021'])
        if (Object.keys(this.__requestData['config']).length === 0)
                throw Error(errors["SFV022"])

        if(this.__requestData.config.repeat !== undefined && typeof this.__requestData.config.repeat !== "number") throw new Error(errors["SFT022"]) 
           
           if( this.__requestData.config.callTransfer !== undefined) {

            if (typeof this.__requestData['config']['callTransfer']!== 'object')
                throw Error(errors['SFT023'])
            if (Object.keys(this.__requestData['config']['callTransfer']).length === 0)
                throw Error(errors['SFV023'])
               
                if(this.__requestData.config.callTransfer.transferKey === undefined) throw new Error(errors["SFV024"])
                if(typeof this.__requestData.config.callTransfer.transferKey !== "number") throw new Error(errors["SFT024"])

                if(this.__requestData.config.callTransfer.transferNumber === undefined) throw new Error(errors["SFV025"])
                if(typeof this.__requestData.config.callTransfer.transferNumber !== "number") throw new Error(errors["SFT025"])

           }

           if (this.__requestData.config.repeat === undefined && this.__requestData.config.callTransfer === undefined) this.__requestData.config = undefined
       }


        switch (this.__requestData.is_text) {
            case true:

                if (this.__requestData.text === undefined) throw new Error(errors["SFV026"])
                if (typeof this.__requestData.text !== "string" ) throw new Error(errors["SFT026"])
                if (this.__requestData.text.trim() === "" ) throw new Error(errors["SFV027"])

                if (this.__requestData.speech_rate === undefined) throw new Error(errors["SFV028"])
                if (typeof this.__requestData.speech_rate !== "number") throw new Error(errors["SFT027"])

                if (this.__requestData["speech_rate"] > 2 || this.__requestData["speech_rate"] < 0.5) throw Error(errors["SFV036"])

                if (this.__requestData.language_id === undefined) throw new Error(errors["SFV029"])
                if (typeof this.__requestData.language_id !== "number") throw new Error(errors["SFT028"])

                break;
            case false:

                if (this.__requestData.audio_file_url === undefined) throw new Error(errors["SFV030"])
                if (typeof this.__requestData.audio_file_url !== "string" ) throw new Error(errors["SFT029"])
                if (this.__requestData.audio_file_url.trim() === "" ) throw new Error(errors["SFV031"])

                break;

           
       }

       return true
    }

}

