
var findElementsByNameAndAttribute = function(element, dom, result){
	for(var c in dom){
		if(dom[c].type == "tag"){
			if(dom[c].children){
				findElementsByNameAndAttribute(element, dom[c].children, result);
			}
			if(dom[c].name == element['name']){
				result.push({ 'link' : dom[c].attribs[element['attr']]})
			}
		}
	}
	return result;
}

module.exports = {
	findElementsByNameAndAttribute: findElementsByNameAndAttribute
}