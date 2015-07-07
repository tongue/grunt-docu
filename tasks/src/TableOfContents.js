(function (win, doc) {
	// ------------------------------------------------------------------------
	// Helpers
	// ------------------------------------------------------------------------

	function _q(selector, parent) {
		parent = parent || doc;
		return parent.querySelectorAll(selector);
	}

	function _forEach(collection, callback, scope) {
		for (var i = 0, len = collection.length; i < len; i++) {
			callback.call(scope, collection[i], i, collection);
		}
	}

	function _getDistance(el) {
		var location = 0;

		if (el.offsetParent) {
			while (el) {
				location += el.offsetTop;
				el = el.offsetParent;
			}
		}
		location = location - 30; // 30 is an offset
		return location >= 0 ? location : 0;
	}

	function _createElement(type, classes) {
		var el = window.document.createElement(type);
		if (classes) {
			el.className = classes;
		}
		return el;
	}

	function _getDepth(heading) {
		return parseFloat(heading.tagName.toLowerCase().substr(1, 1));
	}

	function _createId(string) {
		return string.toLowerCase().replace(/[^a-z0-9 -]/gi, '').replace(/ /gi, '-').substr(0, 50);
	}

	// ------------------------------------------------------------------------
	// Table of Contents
	// ------------------------------------------------------------------------

	var html = '';
	var startDepth = 0;
	var openListStyleTag = '<ul>';
	var closeListStyleTag = '</ul>';
	var openListTag = '<li>';
	var closeListTag = '</li>';
	var tableOfContentsElement;
	var currentDepth;

	function buildTableOfContents() {
		currentDepth = startDepth;

		_forEach(_q('.docu-header'), function (header, index) {
			var depth = _getDepth(header);
			if (index > 0 || (index === 0 && depth !== currentDepth)) {
				changeDepth(depth);
			}

			html += formatLink(header);
		});

		changeDepth(startDepth, true);
		tableOfContentsElement = _createElement('tableOfContentsElement', 'docu-toc');
		doc.body.appendChild(tableOfContentsElement);
		tableOfContentsElement.innerHTML = html;

		setupScrollSpy();
	}

	function formatLink(header) {
		var id = (header.id === "") ? _createId(header.textContent) : header.id;
		header.setAttribute('id', id);
		return '<a href="#' + id + '">' + header.textContent + '</a>';
	}

	function changeDepth(newDepth, last) {
		last = last || false;

		if (newDepth > currentDepth) {
			var openingTags = [];
			for (var i = currentDepth; i < newDepth; i++) {
				openingTags.push(openListStyleTag);
			}
			var li = openListTag;
			html += openingTags.join(li) + li;
		} else if (newDepth < currentDepth) {
			var closingTags = [];
			for (var j = currentDepth; j > newDepth; j--) {
				closingTags.push(closeListStyleTag);
			}
			html += closeListTag + closingTags.join(closeListTag);

			// If it's not the alst one open up next block
			if (!last) {
				html += closeListTag + openListTag;
			}
		} else {
			if (!last) {
				html += closeListTag + openListTag;
			}
		}

		currentDepth = newDepth;
	}

	// ------------------------------------------------------------------------
	// Scroll spy
	// ------------------------------------------------------------------------

	var scrollSpyAnchors = [];
	var currentAnchor;
	var highlightCssClass = 'highlight';
	var eventTimeout = null;

	function setupScrollSpy() {
		_forEach(_q('a', tableOfContentsElement), addScrollSpyObject);
		setDistances();
	}

	function setDistances() {
		_forEach(scrollSpyAnchors, function (anchor) {
			anchor.distance = _getDistance(anchor.target);
		});
		sortAnchors();
	}

	function sortAnchors() {
		scrollSpyAnchors.sort(function (a, b) {
			if (a.distance > b.distance) {
				return -1;
			}
			if (a.distance < b.distance) {
				return 1;
			}
			return 0;
		});
	}

	function addScrollSpyObject(el) {
		var target = doc.getElementById(el.getAttribute('href').substr(1));
		scrollSpyAnchors.push({
			el: el,
			target: target,
			distance: 0
		});
	}

	function getCurrentAnchor() {
		var position = win.pageYOffset;

		// Loop through all anchor elements and find which one is closes to our current position
		for (var i = 0, len = scrollSpyAnchors.length; i < len; i++) {
			var anchor = scrollSpyAnchors[i];
			if (anchor.distance < position) {
				return highlightAnchor(anchor);
			}
		}
	}

	function highlightAnchor(anchor) {
		var currentElement = (currentAnchor) ? currentAnchor.el : _createElement('div');
		if (anchor.el !== currentElement) {
			if (currentAnchor) {
				currentAnchor.el.classList.remove(highlightCssClass);
				if (currentAnchor.parent) {
					currentAnchor.parent.classList.remove(highlightCssClass);
				}
			}

			anchor.el.classList.add(highlightCssClass);
			if (anchor.parent) {
				anchor.parent.classList.add(highlightCssClass);
			}

			// Set new currentAnchor
			currentAnchor = {
				el: anchor.el,
				parent: anchor.parent
			};

			// Dispatch event
			tableOfContentsElement.dispatchEvent(new CustomEvent('highlightchange', {'detail': anchor.el}));
		}
	}

	function eventThrottler(event) {
		if (!eventTimeout) {
			eventTimeout = setTimeout(function () {
				eventTimeout = null;
				if (event.type === 'resize') {
					setDistances();
				}
				getCurrentAnchor();

			}, 66);
		}
	}

	// ------------------------------------------------------------------------
	// Init
	// ------------------------------------------------------------------------

	buildTableOfContents();
	win.addEventListener('resize', eventThrottler, false);
	win.addEventListener('scroll', eventThrottler, false);
})(window, window.document);