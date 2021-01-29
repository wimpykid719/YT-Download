class menu {
	constructor() {
		this.DOM = {}
		this.DOM.menu = document.querySelector('.menu');
		this.DOM.Download = document.querySelector('.main');
		this.DOM.Tags = document.querySelector('.main2');
		this.DOM.songs = document.querySelector('.songs');
		this.DOM.languageInputs = document.querySelectorAll('.language input[name="country"]')
		this._addEvent();
	}

	chosePage(page) {
		const pageClass = this.DOM[page].classList;
		
		if(!pageClass.contains('activateP')){
			const activate = document.querySelector('.activateP')
			activate.classList.remove('activateP')
			pageClass.add('activateP');
			if(page == 'Tags' && urlsFromPython && songDatasFromPython) {
				//ここで新しくインスタンスを生成して変数に格納してるの注意
				this.songDatas = new songDatas(urlsFromPython, songDatasFromPython);
			}
		}
	}

	pageChange(elm) {
		let clickedElemnt = elm.target;
		const menu = clickedElemnt.closest('.menu');
		const active = menu.querySelector('.active');

		if(clickedElemnt.tagName != 'UL') {
			if(clickedElemnt.tagName != 'LI') {
				clickedElemnt = clickedElemnt.closest('LI');
			}
			active.classList.remove('active');
			clickedElemnt.classList.add('active');
			const page = clickedElemnt.textContent;
			this.chosePage(page);
			
		}
	}

	//songDataLaungageを似てるから統合したい。
	choseSongData(clickedElemnt) {
		let song = clickedElemnt.textContent;
		let songNumber = Number(song.slice(-1)) - 1;
		let selectedValue = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language']
		if(selectedValue == '1') {
			let EN = document.querySelector('#EN');
			EN.checked = true;
			let songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['USA']
			this.songDatas.changeFormData(songData);
		}else {
			let JPN = document.querySelector('#JPN');
			JPN.checked = true;
			let songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['JPN']
			this.songDatas.changeFormData(songData);
		}
		

	}

	songDataChange(elm) {
		let clickedElemnt = elm.target
		const songs = clickedElemnt.closest('.songs');
		const active = songs.querySelector('.selected');

		if(clickedElemnt.tagName == 'LI') {
			active.classList.remove('selected');
			clickedElemnt.classList.add('selected');
			this.choseSongData(clickedElemnt);
		}
	}

	songDataLaungage(elm) {
		let selected = document.querySelector('.selected').textContent;
		let songNumber = Number(selected.slice(-1)) - 1;
		let changedElemt = elm.target;

		if(changedElemt.value == '1') {
			let songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['USA'];
			this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'] = '1'
			this.songDatas.changeFormData(songData);
			this.songDatas
		} else {
			let songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['JPN'];
			this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'] = '2'
			this.songDatas.changeFormData(songData);
		}
		
	}
	

	_addEvent() {
		this.DOM.menu.addEventListener("click", this.pageChange.bind(this));
		this.DOM.songs.addEventListener("click", this.songDataChange.bind(this));
		this.DOM.languageInputs.forEach(input => input.addEventListener("change", this.songDataLaungage.bind(this)));
		

	}
}

test = new menu();

class songDatas {
	constructor(urls, songDatasDict) {
		this.songDatasDict = songDatasDict;
		this.urls = urls;
		this.DOM = {};
		this.DOM.nameInput = document.querySelector('.song__name input');
		this.DOM.artistInput = document.querySelector('.song__artist input');
		this.DOM.albumInput = document.querySelector('.song__album input');
		this.DOM.categoryInput = document.querySelector('.song_category input');
		this.DOM.yearInput = document.querySelector('.song__year input');
		//フォームに最初に登録したURLの情報を表示しておく。
		//ここでエラーが出ることがあったタイミングの問題か？？？
		//URLが原因だった。
		const songDataEn1 = this.songDatasDict[this.urls[0]]['USA']
		this.urls.forEach( url => {
			this.songDatasDict[url]['language'] = '1'
		});
		console.log(this.songDatasDict)
		this.changeFormData(songDataEn1);
		
	}

	changeFormData(songData) {
		if(!Object.keys(songData).length == 0){
			this.DOM.nameInput.value = songData['name'];
			this.DOM.artistInput.value = songData['artist'];
			this.DOM.albumInput.value = songData['album'];
			this.DOM.categoryInput.value = songData['category'];
			this.DOM.yearInput.value = songData['year'];
		} else {
			this.DOM.nameInput.value = "";
			this.DOM.artistInput.value = "";
			this.DOM.albumInput.value = "";
			this.DOM.categoryInput.value = "";
			this.DOM.yearInput.value = "";
		}
	}
}

let urlsFromPython = []
let songDatasFromPython = {}

eel.expose(addSongData)
function addSongData(urls, songDatas){
	urlsFromPython = urls;
	songDatasFromPython = songDatas;
}