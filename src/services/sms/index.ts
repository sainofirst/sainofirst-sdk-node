import * as config from "../../config.json"
import * as errors from "../../errors.json"
import axios, {AxiosInstance} from "axios"

/**
 *  Programmatically send high volumes of text messages globally. Your users can get OTP, alerts, stock prices, account balance, transaction statements, discounts, offers and much more all over a message.
 */

class Sms {
   /**
     * Sainofirst api key
     * 
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
     * Returns request dictionary from sms service
     * @return Object
     */
    get() {
        return this.__requestData
    }

    /**
     * Sets configuration options for sms service
     * @param options  
     * 
     */

    set(options : {senderid:String, route: String, unicode? : Number, flash? : Number}) {
        // raise if type of options parameter is not dictionary
        if (typeof options != 'object') {
            throw Error(errors['SFT002'])
        }

        // adds options data to request dictionary
        if ("senderid" in options) {
            this.__requestData = {...this.__requestData, "senderid":options['senderid']}      
        }
        if ("route" in options) {
            this.__requestData = {...this.__requestData, "route":options['route']}      
        }
        if ("unicode" in options) {
            this.__requestData = {...this.__requestData, "unicode":options['unicode']}      
        }
        if ("flash" in options) {
            this.__requestData = {...this.__requestData, "flash":options['flash']}      
        }

        return this

    }

    /**
     * Schedules a text message
     * @param time - Schedule time (in format i.e, yyyy-mm-dd hh:mm:ss) at which the SMS has to be sent
     * 
     */
    schedule(time:string){


        this.__requestData = {...this.__requestData, time:time}
        return this;
    }

    /**
     * Set the list of  numbers for sms to be send to
     * @param numbers list of numbers you want your SMS to be delivered to
     */

    numbers(numbers:Array<string>) {
        this.__requestData= {...this.__requestData, number:numbers}
        return this
    }

    /**
     *  Set text body for the sms
     * @param message text content of SMS
     */
    message(message:string, ) { 
        this.__requestData= {...this.__requestData, message:message}
        return this;
    }

     /**
     * Sends SMS
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
                
            
            if (typeof args[args.length-1] === 'function') {
                callback = args[args.length-1]
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
            url:config.endpoints["bulk-sms"],
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
                url:config.endpoints["bulk-sms"],
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

    /**
     *  Helper method to validate the request data 
     */

    private __validation() {

        if(this.__requestData.message === undefined) 
            throw new Error(errors['SFV003'])
        if(this.__requestData.senderid === undefined) 
            throw new Error(errors['SFV004'])
        if(this.__requestData.route === undefined) 
            throw new Error(errors['SFV005'])
        if(this.__requestData.number === undefined) 
            throw new Error(errors['SFV006'])

        if(typeof this.__requestData.message !== "string") 
            throw new Error(errors['SFT006'])
        if(typeof this.__requestData.senderid !== "string") 
            throw new Error(errors['SFT007'])
        if(typeof this.__requestData.route !== "string") 
            throw new Error(errors['SFT008'])
        if(!(this.__requestData.number instanceof Array)) 
            throw new Error(errors['SFT009'])

        if (this.__requestData.length == 0)
            throw Error(errors["SFV016"])

        this.__requestData["number"].forEach(number => {
            if (typeof number != "string")
                throw Error(errors["SFV017"])
            if (number.trim() === "")
                throw Error(errors["SFV018"])  
        })

        this.__requestData["number"] = this.__requestData["number"].toString()

        if(this.__requestData.message.trim() === "") 
            throw new Error(errors['SFV007'])
        if(this.__requestData.senderid.trim() === "") 
            throw new Error(errors['SFV008'])
        if(this.__requestData.route.trim() === "") 
            throw new Error(errors['SFV009'])
        if(this.__requestData.number.trim() === "")     
            throw new Error(errors['SFV010'])

        if(this.__requestData.unicode !== undefined && this.__requestData["unicode"]!== 0 && this.__requestData["unicode"]!== 1) 
            throw new Error(errors['SFT010'])
        if(this.__requestData.flash !== undefined && this.__requestData["flash"]!== 0 && this.__requestData["flash"]!== 1) 
            throw new Error(errors['SFT011'])

        if(this.__requestData.time !== undefined  ){
            if(typeof this.__requestData.time !== "string") 
                throw new Error(errors['SFT012'])
            if(this.__requestData.time.trim() === "") 
                throw new Error(errors['SFT013'])
            if(new RegExp("[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]\s[0-2][0-9]:[0-5][0-9]:[0-5][0-9]").test(this.__requestData.time) !== true) 
                throw new Error(errors['SFV011'])
        } 




    }

}

export  = Sms