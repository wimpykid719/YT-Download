class AddDLcard {
	constructor() {
		this.DOM = {};
		this.DOM.container = document.querySelector('.add__button');
		this.DOM.dlcardWrap = document.querySelector('.dlcardWrap');
		this.eventType = this._getEventType();
		this._addEvent();
	}

	_getEventType() {
		//スマホで見る場合このプロパティが存在する事になる    True        False
		return window.ontouchstart ? 'touchstart' : 'click';
	}

	_addEvent() {
		// thisを束縛しないとaddEventListerが取得される。ためMobileMenu内の関数なので束縛が必要
		this.DOM.container.addEventListener(this.eventType, this._click.bind(this));
		
	}

	showUp(elm){
		let fadeeffect = elm;
		fadeeffect.classList.add('showeffect');
	}

	_click() {
		const dlcards = document.querySelectorAll('.dlcard');
		this.DOM.dlcard = dlcards[dlcards.length - 1];
		let addElement = this.DOM.dlcard.cloneNode(true);
		addElement.classList.remove('showeffect');
		addElement.querySelector('.dlcard__title > .dlcard__videoName').innerText = '';
		let thumbnail = addElement.querySelector('.dlcard__thumbnail');
		thumbnail.querySelector('img').src = 'images/pinkguy.jpg';
		const classNames = thumbnail.querySelector('.dlcard__thumbnail--cover').classList;
		let thumbnailClassName = classNames[1];
		let dlcardNumber = thumbnailClassName.match(/[0-9]+/)[0];
		let thumbnailNumber = `thumbnail-${Number(dlcardNumber) + 1}`
		//thumbnail.jsのインスタンスにアクセスしてる。
		thumbnailClass.Flags[thumbnailNumber] = ''
		thumbnail.querySelector('.dlcard__thumbnail--cover').classList.replace(thumbnailClassName, thumbnailNumber);
		addElement.querySelector('.dlcard__url > input').value = '';
		addElement.querySelector('.dlcard__url > input').placeholder = 'URL：https://www.youtube.com/watch?v=';
		this.DOM.dlcardWrap.appendChild(addElement);
		window.setTimeout(this.showUp, 150, addElement);

	}
}

new AddDLcard();
