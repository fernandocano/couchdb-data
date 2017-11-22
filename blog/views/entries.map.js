function (doc) {
	if (doc.title && doc.timestamp) {
		emit (Date.parse(doc.timestamp), doc.title);
	}
}
