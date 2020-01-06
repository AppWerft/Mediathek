const parseNode = function(itemNode) {
 	var entry = {};
	var entry = {
		station : itemNode.getElementsByTagName('station').item(0).getTextContent().toLowerCase(),
		title : itemNode.getElementsByTagName('title').item(0).getTextContent(),
		author : itemNode.getElementsByTagName('author').item(0).getTextContent(),
		sendung : itemNode.getElementsByTagName('sendung').item(0).getTextContent(),
		
		datetime : itemNode.getElementsByTagName('datetime').item(0).getTextContent(),
	};
	if (itemNode.hasAttributes()) {
		const attributes = itemNode.getAttributes();
		entry.url = attributes.getNamedItem('url') ? attributes.getNamedItem('url').nodeValue : null;
		entry.duration = 1000* attributes.getNamedItem('duration').nodeValue;
		entry.deliveryMode = attributes.getNamedItem('deliveryMode').nodeValue;
		entry.file_id = attributes.getNamedItem('file_id').nodeValue;
	}
	return entry;
};

exports.parseXMLDoc = function(xml) {
	var entries = [];
	var itemsNodelist = xml.getElementsByTagName("item");
	var length = itemsNodelist.getLength();
	if (length !== 0) {
		for (var nodelistindex = 0; nodelistindex < length; nodelistindex++) {
		    const item = parseNode(itemsNodelist.item(nodelistindex));
			//if (item.url.match(/\.mp3$/))
    			entries.push(item);
    	//	else console.log(item.url);	
		}
	} else
		console.log('Warning: items are null');
	return entries;
};
