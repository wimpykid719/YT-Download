class ProgressBar {
	constructor() {
		this.DOM = {};
		this.DOM.btn = document.querySelector('.downloadButton__circle');		
		this.DOM.container = document.querySelector('.downloadButton');
		this.DOM.icon = document.querySelector('.icon-arrow-down');
		this.DOM.progress = document.querySelector('.progressBar');
		this.DOM.inputURL = document.querySelectorAll('.dlcard__url > input');
		this.DOM.progressNumber = document.querySelector('#progress-css');
		this.eventType = this._getEventType();
		this._addEvent();
	}

	_getEventType() {
		//スマホで見る場合このプロパティが存在する事になる    True        False
		return window.ontouchstart ? 'touchstart' : 'click';
	}

	_transform() {
		const urls = []
		if(this.DOM.container.classList.contains('open')){
			this.DOM.icon.style.display = 'none';
			this.DOM.progress.style.display = 'block';
			console.log('付けました。')
			if(this.DOM.inputURL[0].value){
				this.DOM.inputURL.forEach((el) => {
					urls.push(el.value)
					});
				//Pythonプログラムを実行する。
				eel.dowload(urls);
			}
		}else{
			this.DOM.btn.style.position = '';
			this.DOM.icon.style.display = '';
			this.DOM.progress.style.display = 'none';
		}
		
	}


	_toggle() {
		 this.DOM.container.classList.toggle('open');
	}

	// 分けたのは後でaddEventListerを複数登録する予定のため
	_addEvent() {
		// thisを束縛しないとaddEventListerが取得される。ためMobileMenu内の関数なので束縛が必要
		this.DOM.btn.addEventListener(this.eventType, this._toggle.bind(this));
		this.DOM.btn.addEventListener(this.eventType, this._transform.bind(this));
	}

	putProgress(n) {
		console.log(n)
		this.DOM.progressNumber.style.width = `${n}%`;

	}

}

class AddDLcard {
	constructor() {
		this.DOM = {};
		this.DOM.container = document.querySelector('.add__button');
		this.DOM.dlcard = document.querySelector('.dlcard')
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

	_click() {
		const addElement = this.DOM.dlcard.cloneNode(true);
		this.DOM.dlcardWrap.appendChild(addElement);
	}
}



const p = new ProgressBar();
const putProgress = p.putProgress()
eel.expose(putProgress) 
new AddDLcard();
