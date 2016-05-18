var start = new Date().getTime();
var fs = require('fs'),
request = require('request'),
htmlparser = require('htmlparser'),
async = require('async');
var links = [];

var pageNums = [], results = [];
for(var page = 365 ; page <= 369 ; page++){
	/*links.push('Page ' + page);
	urls.push("http://www.team-bhp.com/forum/motorbikes/138082-ktm-duke-390-ownership-experience-thread-"+page+".html");*/
	pageNums.push(page);
}

var readPage = function(pageNum, callback){
	request({
        uri: "http://www.team-bhp.com/forum/motorbikes/138082-ktm-duke-390-ownership-experience-thread-"+pageNum+".html"
    }, function (err, response, body) {
        if (err) return callback(err);
        parseHtml(body, pageNum, callback);
    });
}

var parseHtml = function (body, pageNum, callback) {
    var handler = new htmlparser.DefaultHandler();
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(body);
    iterate(handler.dom, pageNum);
    callback(null, null);
}

function iterate(dom, pageNum){
	for(var c in dom){
		if(dom[c].type == 'tag'){
			if(dom[c].children){
				iterate(dom[c].children, pageNum);	
			}else if(dom[c].name == 'img'){
				var link = dom[c].attribs.src;
				if(link.indexOf('team-bhp.com') != -1 && link.indexOf('attachments') != -1) links.push({'link' : link, 'pno' : pageNum});
			}
			
		}
	}
}

var finalProcess = function(err, finalResult){
	if(err) console.log(err);
	
	console.log(links);
    console.log("Time taken : " + (new Date().getTime() - start) + " ms");
}

async.mapSeries(pageNums, readPage, finalProcess);


