function (doc) {
	if (doc.timestamp && doc.status && doc.status === 2) {
		emit (doc.timestamp, null);
	}
}
