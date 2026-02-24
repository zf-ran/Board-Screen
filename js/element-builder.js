class ElementBuilder {
  constructor(tag) {
		/** @type {HTMLInputElement} */
    this.element = document.createElement(tag);
	}

	/** @param {string} content */
	innerHTML(content) {
		this.element.innerHTML = content;
		return this;
	}

	/**
	 * Insert element's `innerText`.
	 * @param {string} content
	 */
	text(content) {
		this.element.innerText = content;
		return this;
	}

	/**
	 * @param {Object<string, string>} attributes - Element's attributes: `{attr1: 'yes', attr2: 'false', ...}`
	 */
	attributes(attributes) {
		for (const [attribute, value] of Object.entries(attributes)) {
			if (typeof value === 'boolean')
				this.element[attribute] = value;
			else
				this.element.setAttribute(attribute, value);
		}

		return this;
	}

	id(id) {
		this.element.id = id;
		return this;
	}

	/**
	 * @param {string[]} classes - Array of classes to add.
	 */
	classes(classes) {
		for (const className of classes) {
			this.element.classList.add(className);
		}

		return this;
	}

	appendTo(parent = document.body) {
		parent.appendChild(this.element);
		return this.element;
	}
}