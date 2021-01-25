class covre {
	constructor() {
		this.DOM = {}
		this.DOM.coverInput = document.querySelector('.song__cover input');
		this.DOM.coverArt = document.querySelector('.song__cover img');
		this._addEvent();

	}

	coverChange(elm) {
		const img = this.DOM.coverArt
		const path = URL.createObjectURL(elm.target.files[0]);
		img.src = path;
		img.onload = function() {
			URL.revokeObjectURL(this.src);
		  }
	}

	_addEvent() {
		this.DOM.coverInput.addEventListener("change", this.coverChange.bind(this));
	}
}

new covre();