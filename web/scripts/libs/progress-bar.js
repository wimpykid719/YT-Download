class ProgressBar {
	constructor() {
		this.DOM = {};
		this.DOM.btn = document.querySelector('.downloadButton__circle');		
		this.DOM.container = document.querySelector('.downloadButton');
		this.DOM.icon = document.querySelector('.icon-arrow-down');
		this.DOM.progress = document.querySelector('.progressBar');
		
		this.DOM.form = document.querySelector('.youtubeDownload > form');
		this.eventType = this._getEventType();
		this._addEvent();
	}

	_getEventType() {
		//スマホで見る場合このプロパティが存在する事になる    True        False
		return window.ontouchstart ? 'touchstart' : 'click';
	}

	_transform() {
		this.DOM.inputURL = document.querySelectorAll('.dlcard__url > input');
		const urls = []
		if(this.DOM.container.classList.contains('open')){
			this.DOM.icon.style.display = 'none';
			this.DOM.progress.style.display = 'block';
			console.log('付けました。')
			if(this.DOM.inputURL[0].value){
				this.DOM.inputURL.forEach((el) => {
					urls.push(el.value)
					});
					let radioNodeList = this.DOM.form.type;
				//Pythonプログラムを実行する。
				eel.dowload(urls, radioNodeList.value);
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


}




let progress = new ProgressBar();

eel.expose(putProgress)
function putProgress(n) {
	let DOM = {};
	DOM.progressState = document.querySelector('#progress-css');
	DOM.progressNumber = document.querySelector('#css-pourcent');
	DOM.progressState.style.width = `${n}%`;
	DOM.progressNumber.innerHTML = `${n}%`;

}

eel.expose(doneProgress)
function doneProgress() {
	console.log(progress.DOM.icon);
	progress.DOM.container.classList.remove('open');
	progress.DOM.icon.style.display = '';
	progress.DOM.progress.style.display = 'none';

}