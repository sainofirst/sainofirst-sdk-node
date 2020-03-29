import Sainofirst from '../src/index'
import * as assert from "assert"



describe("Api key", function() {
    it("Should throw error if apikey is not set", function() {
        assert.throws(()=>{
            new Sainofirst()
       }, Error)
    })

    it("Should throw error if apikey is empty string", function() {
        
        assert.throws(()=>{
             new Sainofirst("")
        }, Error)

    })

    it("should return instance of Sainofirst if api key exists", function() {
        const sf = new Sainofirst("uhhjhh")

        assert.ok(sf instanceof Sainofirst)

    })
})