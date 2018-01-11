function (doc) {
	if (doc.title && doc.timestamp) {
		emit (Date.parse(doc.timestamp), {
			title: doc.title,
			icon: doc.pageId === 'entry' ? 'fa-headphones' : 'fa-comment'
		});
	}
}
