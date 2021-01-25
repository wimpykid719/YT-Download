class effect {
	constructor(){
		this.DOM = {}
		this.DOM.fadeeffects = document.querySelectorAll('.fadeeffect')
		this._addEvent();
	}

	showUp(){
		this.DOM.fadeeffects.forEach((fadeeffect) => {
			fadeeffect.classList.add('showeffect')
		});
	}

	_addEvent(){
		window.addEventListener("load", this.showUp.bind(this))
	}
}

new effect();