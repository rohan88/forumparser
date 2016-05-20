var htmlparser = require('htmlparser');

var getDom = function (pageDetails, callback) {
    var handler = new htmlparser.DefaultHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(pageDetails["body"]);
    delete pageDetails["body"];
    pageDetails['dom'] = handler.dom;
    return pageDetails;
}

module.exports = {
	getDom : getDom
}