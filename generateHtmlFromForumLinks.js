var start = new Date().getTime();
var fs = require('fs'),
request = require('request'),
htmlparser = require('htmlparser'),
async = require('async');
var links = "<html><body>";

var pageNums = [], results = [];
for(var page = 2 ; page <= 18 ; page++){
	/*links.push('Page ' + page);
	urls.push("http://www.team-bhp.com/forum/motorbikes/138082-ktm-duke-390-ownership-experience-thread-"+page+".html");*/
	pageNums.push(page);
}

var readPage = function(pageNum, callback){
	request({
        uri: "http://www.team-bhp.com/forum/superbikes-imports/163422-godzilla-my-monster-japan-kawasaki-z800-now-hp-corse-hydroform-"+pageNum+".html"
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
				if(link.indexOf('team-bhp.com') != -1 && link.indexOf('attachments') != -1) links += '<a target="_blank" href="'+link+'" data-pno="'+pageNum+'" >'+link+'</a><br/> ';
			}
			
		}
	}
}

var finalProcess = function(err, finalResult){
	if(err) console.log(err);
	

	links += "Time taken : " + (new Date().getTime() - start) + " ms";
	links += '</body></html>';
	console.log(links);
}

async.mapSeries(pageNums, readPage, finalProcess);


