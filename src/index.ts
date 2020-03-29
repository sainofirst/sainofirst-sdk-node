import Sms from "./services/sms";
import Voice from "./services/voice";
import errors from "./errors.json";

/**
 * 
 *The Sainofirst SDK for python provides a python API for Sainofirst services.You can use the python API to build libraries or applications for python.Using the SDK for python makes it possible to realize a number of compelling use cases. their are several things you can build by using the SDK for python.
 * 
 */

class Sainofirst {
    /**
     * Sainofirst api key
     * 
     */
    private __apiKey:String;


     /**
     * sms service instance
     */
    sms:Sms;

    /**
     * voice service instance
     */
    voice:Voice;

    constructor(apiKey?:String) {
        
        // if environment variable is set it will have that value if not then it will have api key provided via constructor
        this.__apiKey =  apiKey || process.env.SAINOFIRST_API_KEY 
        this.sms = new Sms(this.__apiKey);
        this.voice = new Voice(this.__apiKey);
        
        
        if(this.__apiKey === undefined )  throw Error(errors["SFV001"])
        if(typeof this.__apiKey !== "string") throw Error(errors["SFT001"])
        if(this.__apiKey.trim() === "") throw Error(errors["SFV002"])
    }  
}


export  =  Sainofirst