import * as config from "../../config.json"
import * as errors from "../../errors.json"
import axios, { AxiosInstance } from "axios"

/**
 *  Programmatically send high volumes of text messages globally. Your users can get OTP, alerts, stock prices, account balance, transaction statements, discounts, offers and much more all over a message.
 */

class EmailCleaner {
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
      headers: { 'token': `${this.__apiKey}`, 'content-type': 'application/json' }
    });

    if (this.__apiKey === undefined) throw Error(errors["SFV001"])
    if (typeof this.__apiKey !== "string") throw Error(errors["SFT001"])
    if (this.__apiKey.trim() === "") throw Error(errors["SFV002"])


  }
  /**
   * Upload Attchments
   */
  Bulk(...args: any[]) {
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
        url: config.endpoints["bulk-email-verification"],
        method: 'POST',
        data: args[0],
        headers: { 'token': `${this.__apiKey}`, ...newHeaders },
      }).then(r => {
        this.__requestData = {}
        callback(r.data, null)
      }).catch(e => {
        callback(null, e.response)
      })

    } else {
      return new Promise((resolve, reject) => {
        this.__http.request({
          url: config.endpoints["bulk-email-verification"],
          method: 'POST',
          data: args[0],
          headers: { 'token': `${this.__apiKey}`, ...newHeaders },
        }).then(r => {
          this.__requestData = {}
          resolve(r.data)
        }).catch(e => {
          reject(e.response)
        })

      })
    }
  }

  /**
    *  "single-email-verification": "/email-cleaning/verify-single",
           "bulk-email-status": "/email-cleaning/bulk-progress"
    */
  Singel(...args: any[]) {

    let callbackExist = false
    let optionExist = false
    let callback: (r, e) => void;

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

    if (!this.__requestData.email) {
      throw Error(`SFC005: Email not provided.`)
    }
    if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.__requestData.email) !== true) {
      throw Error(`SFC004: Invalid email id found.`)
    }

    if (callbackExist) {
      this.__http.request({
        url: config.endpoints["single-email-verification"],
        method: 'GET',
        params: {
          email: this.__requestData.email
        }
      }).then(r => {
        this.__requestData = {}
        callback(r.data, null)
      }).catch(e => {
        callback(null, e.response)
      })

    } else {
      return new Promise((resolve, reject) => {
        this.__http.request({
          url: config.endpoints["single-email-verification"],
          method: 'GET',
          params: {
            email: this.__requestData.email
          }
        }).then(r => {
          this.__requestData = {}
          resolve(r.data)
        }).catch(e => {
          reject(e.response)
        })

      })
    }
  }

  Status(...args: any[]) {

    let callbackExist = false
    let optionExist = false
    let callback: (r, e) => void;

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

    if (!this.__requestData.bulk_id) {
      throw Error(`SFC002 'bulk_id' field should not be empty!`)
    }
    if (typeof this.__requestData.bulk_id !== "number")
      throw Error(`SFC002 'bulk_id' field should be a number!`)

    if (callbackExist) {
      this.__http.request({
        url: config.endpoints["bulk-email-status"],
        method: 'GET',
        params: {
          bulk_id: this.__requestData.bulk_id
        }
      }).then(r => {
        this.__requestData = {}
        callback(r.data, null)
      }).catch(e => {
        callback(null, e.response)
      })

    } else {
      return new Promise((resolve, reject) => {
        this.__http.request({
          url: config.endpoints["bulk-email-status"],
          method: 'GET',
          params: {
            bulk_id: this.__requestData.bulk_id
          }
        }).then(r => {
          this.__requestData = {}
          resolve(r.data)
        }).catch(e => {
          reject(e.response)
        })

      })
    }
  }
}

export = EmailCleaner;