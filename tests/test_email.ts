import Sainofirst from '../src/index'
var assert = require('assert');
const FormData = require('form-data');
const fs = require('fs');


describe.skip('Email', function () {
    it.only('should return true', function (done) {
        const sf = new Sainofirst("==/asd")
        sf.email.send({
            to: "test@test.com",
            subject: " sdk test 1",
            from: "test@test.com",
            bodyHtml: "<h1>SDK Test with attchments</h1>",
            fromName: "test",
            attachments: [13],
            callbackUrl: "https://test.com/webhook"
        }, (res, err) => {
            console.log(res, err, true)
            done()
        })
    });

    it('attchment upload', function (done) {
        const formData = new FormData();
        formData.append('yinyang.png', fs.createReadStream('/link-to-file/'));

        const sf = new Sainofirst("asd")

        sf.email.upload(formData, (res, err) => {
            console.log(err, res, "error");
            // assert.equal(res.status, true)
            done()
        })
    })


    it('attchment upload', async function () {
        const formData = new FormData();
        formData.append('yinyang.png', fs.createReadStream('/link-to-file/'));

        const sf = new Sainofirst("==/da")

        const data = await sf.email.upload(formData);
        console.log(data);
    })
});
