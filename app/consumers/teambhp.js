var start = new Date().getTime();
var rp = require('../services/readPage');
var pp = require('../services/parsePage');
var fe = require('../services/findElement');
var dload = require('../services/download');
var async = require('async');
var config = require('../../config/default');

var threadLink = "http://www.team-bhp.com/forum/superbikes-imports/28828-superbikes-spotted-india%pageNum%.html"
var from = 298, to = 301;
var elementName = 'img', elementAttr = 'src';
var dloadCtr = 0, totalFiles = 0;
var urls = [];
for(var i = from; i <= to; i++){
	urls.push({ 'url' : threadLink.replace('%pageNum%', (i == 1 ? "" : "-" + i)), 'pno' : i });
}
async.map(urls, rp.readPage, function(err, rawDoms){
	if(err) console.log(err);
	generateDom(rawDoms);
});

function generateDom(rawDoms){
	var allPages = [];
	for(var c = 0; c < rawDoms.length; c++){
		var dom = pp.getDom(rawDoms[c]);
		allPages.push(dom);
	}
	findElements(allPages);
}

function findElements(allPages){
	var allLinks = [];
	for(var c = 0; c < allPages.length; c++){
		var pno = allPages[c]['pno'];
		var result = fe.findElementsByNameAndAttribute({ 'name' : elementName, 'attr' : elementAttr }, allPages[c].dom, []).filter(function(el, idx){
			el['pno'] = pno;
			el['idx'] = idx;
			return (el.link.indexOf('attachments') != -1);
		});
		allLinks = allLinks.concat(result);
	}
	downloadFilesFromLinks(allLinks);
}

function downloadFilesFromLinks(allLinks){
	totalFiles = allLinks.length;
	async.map(allLinks, downloadFile, function(err, results){
		if(err) console.log(err);
		console.log(new Date().getTime() - start + " ms.");
	})
}

function downloadFile(urlDet, cb){
	var link = urlDet.link;
	var fileName = '/' + urlDet.pno + '_' + urlDet.idx + '_' + urlDet.link.substring(urlDet.link.lastIndexOf('/') + 1);
	var filePath = config.settings.download.destination + fileName;
	dload.downloadFromUrl(link, filePath, function(err, dRes){
		if(err) return cb(err);
		console.log(fileName + " downloaded. Progress : " + ((++dloadCtr/totalFiles) * 100) + "%");
		cb(null, dRes);
	});
}