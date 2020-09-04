import Sainofirst from '../src/index'
var assert = require('assert');
const FormData = require('form-data');
const fs = require('fs');


describe('Email', function () {
    it('should return true', function (done) {
        const sf = new Sainofirst("==/asd")
        sf.email.send({
            to: "sahil@sainofirst.com",
            subject: "sahil sdk test 1",
            from: "sahil@sainofirst.com",
            bodyHtml: "<h1>SDK Test with attchments</h1>",
            fromName: "sahil",
            attachments: [13]
        }, (res, err) => {
            console.log(err, res, "error");
            assert.equal(res.status, true)
            done()
        })
    });

    it('attchment upload', function (done) {
        const formData = new FormData();
        formData.append('yinyang.png', fs.createReadStream('/home/sahil/Downloads/sainofirst500.png'));

        const sf = new Sainofirst("asd")

        sf.email.upload(formData, (res, err) => {
            console.log(err, res, "error");
            // assert.equal(res.status, true)
            done()
        })
    })


    it('attchment upload', async function () {
        const formData = new FormData();
        formData.append('yinyang.png', fs.createReadStream('/home/sahil/Downloads/sainofirst500.png'));

        const sf = new Sainofirst("==/da")

        const data = await sf.email.upload(formData);
        console.log(data);
    })
});
