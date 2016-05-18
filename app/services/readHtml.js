var start = new Date().getTime();
	var fs = require('fs'),
	    request = require('request'),
	    htmlparser = require('htmlparser');
	var webUrl = "http://www.team-bhp.com/forum/motorbikes/138082-ktm-duke-390-ownership-experience-thread-368.html";
	var links = [];
	var tasks = [
	    function () {
	        request({
	            uri: webUrl
	        }, function (err, response, body) {
	            if (err) {
	                next(err.message);
	            } else if (response.statusCode == 200) {
	                next(false, body);
	            } else {
	                next('Abnormal request status code.');
	            }
	        });
	    },
	    function (body) {
	        var handler = new htmlparser.DefaultHandler();
	        var parser = new htmlparser.Parser(handler);
	        parser.parseComplete(body);
	        iterate(handler.dom);
	        console.log(links);
	        console.log("Time taken : " + (new Date().getTime() - start) + " ms");
	    }
	];

	function iterate(dom){
		// console.log(dom, '\n', '************************');
		for(var c in dom){
			if(dom[c].type == 'tag'){
				if(dom[c].children){
					iterate(dom[c].children);	
				}
				if(dom[c].name == 'a'){
					var link = dom[c].attribs.href;
					if(link && link.indexOf('team-bhp.com') != -1 && link.indexOf('attachments') != -1) links.push(link);
				}
				
			}
		}
	}

	function next(err, result) {
	    if (err) throw new Error(err);
	    var currentTask = tasks.shift();
	    if (currentTask) {
	        currentTask(result);
	    }
	}
	next();