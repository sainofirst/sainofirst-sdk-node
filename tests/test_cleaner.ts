import Sainofirst from '../src/index'
var assert = require('assert');
const FormData = require('form-data');
const fs = require('fs');


describe('Email Cleaner', function () {
    it.only('should return true', function (done) {
        const sf = new Sainofirst("7yq7x1hlydj8hyxccf9f46e8v121609584683074")
        sf.emailCleaner.Singel({
            email: 'sahil2@saino.io'
        }, (res, err) => {
            console.log(res, err, true)
            done()
        })
    });

    it.skip('attchment upload', function (done) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream('/path-to-file'));

        const sf = new Sainofirst("7yq7x1hlydj8hyxccfjo130m46e8v121609584683074")

        sf.emailCleaner.Bulk(formData, (res, err) => {
            console.log(err, res, "error");
            // assert.equal(res.status, true)
            done()
        })
    });

    it.skip('should return true', function (done) {
        const sf = new Sainofirst("7yq7x1hlydj8hyxccfjo130m7usev121609584683074")
        sf.emailCleaner.Status({
            bulk_id: 1
        }, (res, err) => {
            console.log(res, err, true)
            done()
        })
    });
});
