import Sainofirst from '../src/index'
var assert = require('assert');
// let test = require('./tests.json')





describe('Sms', function() {

        it('should return false', function(done) {
            const sf = new Sainofirst("jbjgg")
            sf.sms.message("your text message here") 
            .numbers(["91888xxxxx", "918323xxxx"])
            .set({  
                "senderid" : "SAIFST", 
                "route" : "Transactional"  
            }).send((res, err) =>{
               
                assert.equal(err.status,false)
                done()
            }) 
        });






});
          