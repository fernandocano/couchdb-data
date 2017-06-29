function (doc) {
	if (doc.sections) {
		for (key in doc.sections) {
			emit (key, 1);
		}
	}
}
