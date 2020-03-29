import Sainofirst from '../src/index'
var assert = require('assert');







describe('Voice', function() {

    it('should return false', function(done) {
        const sf = new Sainofirst("hgghg")
        sf.voice.text("your message")  
        .numbers(["91888xxxxx", "918323xxxx"]) 
        .set({
            "subscription_id" : 26236, 
            "maxLengthOfCall" : 14,  
            "speech_rate" : 1, 
            "language_id" : 0, 
        }).send((res, err) =>{
            assert.equal(err.status, false)
            done()
        }) 
    });
})