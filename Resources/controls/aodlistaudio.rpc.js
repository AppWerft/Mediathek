var parseNode = function(itemNode) {
    console.log(itemNode.toString());
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
		entry.duration = attributes.getNamedItem('duration').nodeValue;
		//    entry.id = attributes..getNamedItem('')
	}
	return entry;
};

exports.parseXMLDoc = function(xml) {
	var entries = [];
	var itemsNodelist = xml.getElementsByTagName("item");
	var length = itemsNodelist.getLength();
	if (length !== 0) {
		for (var nodelistindex = 0; nodelistindex < length; nodelistindex++) {
			entries.push(parseNode(itemsNodelist.item(nodelistindex)));
		}
	} else
		console.log('Warning: items are null');
	return entries;
};
