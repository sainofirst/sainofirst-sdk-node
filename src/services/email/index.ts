import * as config from "../../config.json"
import * as errors from "../../errors.json"
import axios, { AxiosInstance } from "axios"

/**
 *  Programmatically send high volumes of text messages globally. Your users can get OTP, alerts, stock prices, account balance, transaction statements, discounts, offers and much more all over a message.
 */

class Email {
  /**
    * Sainofirst api key
    * 
    */
  private __apiKey: String

  /**
   * request data
   */
  private __requestData: any

  private __http: AxiosInstance;

  constructor(apiKey?: String) {

    // if environment variable is set it will have that value if not then it will have api key provided via constructor
    this.__apiKey = apiKey || process.env.SAINOFIRST_API_KEY


    this.__requestData = {}

    this.__http = axios.create({
      baseURL: config.baseURL,
      headers: { 'Authorization': `Bearer ${this.__apiKey}`, 'content-type': 'application/json' }
    });

    if (this.__apiKey === undefined) throw Error(errors["SFV001"])
    if (typeof this.__apiKey !== "string") throw Error(errors["SFT001"])
    if (this.__apiKey.trim() === "") throw Error(errors["SFV002"])


  }
  /**
   * Upload Attchments
   */
  upload(...args: any[]) {
    let callbackExist = false
    let optionExist = false
    let newHeaders = {};
    let callback: (r, e) => void

    // Check if the arguments exist
    if (args.length != 0) {
      if (typeof args[0] === 'object') {
        let options = args[0]
        optionExist = true;
        this.__requestData = { ...this.__requestData, ...options }
      }

      if (typeof args[args.length - 1] === 'function') {
        callback = args[args.length - 1]
        callbackExist = true;
      }

      //Exceptions
      if (args.length === 1) {
        if (typeof args[0] != 'function' && typeof args[0] != 'object') {
          throw Error(errors["SFT004"])
        }

      }


      if (args.length === 2) {
        if (typeof args[0] != 'object') {
          throw Error(errors["SFT002"])
        }

        if (typeof args[1] !== 'function') {
          throw Error(errors["SFT003"])
        }

      }
      if (args.length > 2) {
        throw Error(errors["SFT005"])
      }
    }
    try {
      newHeaders = args[0].getHeaders()
    }
    catch (err) {

    }

    if (callbackExist) {
      this.__http.request({
        url: config.endpoints["upload-email-attachment"],
        method: 'POST',
        data: args[0],
        headers: { 'Authorization': `Bearer ${this.__apiKey}`, ...newHeaders },
      }).then(r => {
        this.__requestData = {}
        callback(r.data, null)
      }).catch(e => {
        callback(null, e.response.data)
      })

    } else {
      return new Promise((resolve, reject) => {
        this.__http.request({
          url: config.endpoints["upload-email-attachment"],
          method: 'POST',
          data: args[0],
          headers: { 'Authorization': `Bearer ${this.__apiKey}`, ...newHeaders },
        }).then(r => {
          this.__requestData = {}
          resolve(r.data)
        }).catch(e => {
          reject(e.response.data)
        })

      })
    }
  }

  /**
  * Sends SMS
  * 
  */
  send(...args: any[]) {


    let callbackExist = false
    let optionExist = false
    let callback: (r, e) => void

    // Check if the arguments exist
    if (args.length != 0) {

      if (typeof args[0] === 'object') {
        let options = args[0]
        optionExist = true
        this.__requestData = { ...this.__requestData, ...options }
      }


      if (typeof args[args.length - 1] === 'function') {
        callback = args[args.length - 1]
        callbackExist = true

      }

      //Exceptions
      if (args.length === 1) {
        if (typeof args[0] != 'function' && typeof args[0] != 'object') {
          throw Error(errors["SFT004"])
        }

      }


      if (args.length === 2) {
        if (typeof args[0] != 'object') {
          throw Error(errors["SFT002"])
        }

        if (typeof args[1] !== 'function') {
          throw Error(errors["SFT003"])
        }

      }
      if (args.length > 2) {
        throw Error(errors["SFT005"])
      }

    }

    this.__validation()

    if (callbackExist) {
      this.__http.request({
        url: config.endpoints["send-email"],
        method: 'POST',
        data: this.__requestData
      }).then(r => {
        this.__requestData = {}
        callback(r.data, null)
      }).catch(e => {
        callback(null, e.response.data)
      })

    } else {
      return new Promise((resolve, reject) => {
        this.__http.request({
          url: config.endpoints["send-email"],
          method: 'POST',
          data: this.__requestData
        }).then(r => {
          this.__requestData = {}
          resolve(r.data)
        }).catch(e => {
          reject(e.response.data)
        })

      })
    }
  }

  /**
   *  Helper method to validate the request data 
   */

  private __validation() {

    //to email validation
    if (this.__requestData.to === undefined)
      throw new Error(errors['SFE001']);
    if (this.__requestData.to === '')
      throw new Error(errors['SFE002']);
    if (!(this.__requestData.to instanceof Array || typeof this.__requestData.to === 'string'))
      throw new Error(errors['SFE003'])
    if (this.__requestData.to instanceof Array) {
      this.__requestData.to.forEach(email => {
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) !== true)
          throw new Error(errors['SFE004'])
      });
    }
    if (typeof this.__requestData.to === 'string')
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.__requestData.to) !== true)
        throw new Error(errors['SFE004'])


    //subject validation
    if (this.__requestData.subject === undefined)
      throw new Error(errors['SFE005']);
    if (typeof this.__requestData.subject !== "string")
      throw new Error(errors['SFE006'])
    if (this.__requestData.subject === '')
      throw new Error(errors['SFE007']);


    //from validation
    if (this.__requestData.from === undefined)
      throw new Error(errors['SFE008']);
    if (typeof this.__requestData.from !== "string")
      throw new Error(errors['SFE009'])
    if (this.__requestData.from === '')
      throw new Error(errors['SFE010']);
    if (typeof this.__requestData.from === 'string')
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.__requestData.from) !== true)
        throw new Error(errors['SFE011'])

    //from name validation
    if (this.__requestData.fromName !== undefined && typeof this.__requestData.fromName !== "string")
      throw new Error(errors['SFE012']);
    if (typeof this.__requestData.fromName === "string" && this.__requestData.fromName === '')
      throw new Error(errors['SFE013']);

    //bodyhtml validation
    if (this.__requestData.bodyHtml !== undefined && typeof this.__requestData.bodyHtml !== "string")
      throw new Error(errors['SFE014']);
    if (typeof this.__requestData.bodyHtml === "string" && this.__requestData.bodyHtml === '')
      throw new Error(errors['SFE015']);

    //track open valdiation
    if (this.__requestData.trackClicks !== undefined && typeof this.__requestData.trackClicks !== "boolean")
      throw new Error(errors['SFE016']);

    //track click valdiation
    if (this.__requestData.trackOpens !== undefined && typeof this.__requestData.trackOpens !== "boolean")
      throw new Error(errors['SFE017']);

    //reply to email
    if (this.__requestData.replyToEmail !== undefined && typeof this.__requestData.replyToEmail !== "string")
      throw new Error(errors['SFE018']);
    if (typeof this.__requestData.replyToEmail === "string" && this.__requestData.replyToEmail === '')
      throw new Error(errors['SFE019']);
    if (typeof this.__requestData.replyToEmail === 'string')
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.__requestData.replyToEmail) !== true)
        throw new Error(errors['SFE020'])

    //replay to mail
    if (this.__requestData.replyToName !== undefined && typeof this.__requestData.replyToName !== "string")
      throw new Error(errors['SFE021']);
    if (typeof this.__requestData.replyToName === "string" && this.__requestData.replyToName === '')
      throw new Error(errors['SFE022']);

    //body text validation
    if (this.__requestData.bodyText !== undefined && typeof this.__requestData.bodyText !== "string")
      throw new Error(errors['SFE023']);
    if (typeof this.__requestData.bodyText === "string" && this.__requestData.bodyText === '')
      throw new Error(errors['SFE024']);

    //attachment validation 
    if (this.__requestData.attachments !== undefined && !(this.__requestData.attachments instanceof Array))
      throw new Error(errors['SFE025']);
    if (this.__requestData.attachments instanceof Array) {
      this.__requestData.attachments.forEach(id => {
        if (typeof id !== "number")
          throw new Error(errors['SFE026']);
      });
    }

    //body validation
    if (this.__requestData.bodyText === undefined && this.__requestData.bodyHtml === undefined)
      throw new Error(errors['SFE027']);
  }
}

export = Email;