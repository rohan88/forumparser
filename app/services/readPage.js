var request = require('request');

var readPage = function(pageDetails, callback){
	request({
        uri: pageDetails['url']
    }, function (err, response, body) {
        if (err) return callback(err);
        console.log("Read " + pageDetails['url']);
        pageDetails['body'] = body;
		callback(null, pageDetails);
    });
}

module.exports = {
	readPage : readPage
}