/*
	Page 1 - 18 : Z800
	Time taken : 254874 ms
*/
var start = new Date().getTime();
var fs = require('fs'),
request = require('request'),
htmlparser = require('htmlparser'),
async = require('async'),
dload = require('./download');

var dloadDest = "/Users/rohan/Downloads/dell_bkup/workbench/htmlParseDemo/downloads";

var links = [];

var pageNums = [], results = [];
for(var page = 302 ; page <= 303 ; page++){
	/*links.push('Page ' + page);
	urls.push("http://www.team-bhp.com/forum/motorbikes/138082-ktm-duke-390-ownership-experience-thread-"+page+".html");*/
	if(page == 1){
		pageNums.push("");
		continue;
	}
	pageNums.push("-"+page);
}

var readPage = function(pageNum, callback){
	var requestUrl = "http://www.team-bhp.com/forum/superbikes-imports/28828-superbikes-spotted-india"+pageNum+".html";
	request({
        uri: requestUrl
    }, function (err, response, body) {
        if (err) return callback(err);
        parseHtml(body, pageNum, function(err, pRes){
        	if(err) return callback(err);
        	console.log("parsed " + requestUrl);
        	callback(null, pRes);
        });
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
				if(link.indexOf('team-bhp.com') != -1 && link.indexOf('attachments') != -1)
					links.push({'link' : link, 'pno': pageNum, 'idx' : links.length})
			}
			
		}
	}
}

var finalProcess = function(err, finalResult){
	if(err) console.log(err);

	// links += '</body></html>';
	// console.log(links);

	async.map(links, downloadFile, function(err, result){
		if(err) console.log(err);
		console.log("Time taken : " + (new Date().getTime() - start) + " ms");	
	})
}


function downloadFile(urlDet, cb){
	var link = urlDet.link;
	var fileName = urlDet.link.substring(urlDet.link.lastIndexOf('/'));
	var filePath = dloadDest + fileName;
	dload.downloadFromUrl(link, filePath, function(err, dRes){
		if(err) return cb(err);
		console.log(fileName + " downloaded. Progress : " + ((urlDet.idx/links.length) * 100) + "%");
		cb(null, dRes);
	});
}


async.mapSeries(pageNums, readPage, finalProcess);


