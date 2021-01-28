class menu {
	constructor() {
		this.DOM = {}
		this.DOM.menu = document.querySelector('.menu');
		this.DOM.Download = document.querySelector('.main');
		this.DOM.Tags = document.querySelector('.main2');
		this.DOM.songs = document.querySelector('.songs');
		this.DOM.languageInputs = document.querySelectorAll('.language input[name="country"]')
		// this.DOM.languageInputs.forEach(el => console.log(el))
		console.log(this.DOM.languageInputs);
		this._addEvent();
	}

	chosePage(page) {
		const pageClass = this.DOM[page].classList;
		
		if(!pageClass.contains('activateP')){
			const activate = document.querySelector('.activateP')
			activate.classList.remove('activateP')
			pageClass.add('activateP');
			if(page == 'Tags' && urlsFromPython && songDatasFromPython) {
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

	choseSongData(clickedElemnt) {
		let selectedValue = '1'
		this.DOM.languageInputs.forEach(el => {
			if(el.checked) {
				selectedValue = el.checked
			}
		});
		let song = clickedElemnt.textContent;
		let songNumber = Number(song.slice(-1)) - 1;
		let songData = songDatasFromPython[urlsFromPython[songNumber]]['USA']
		this.songDatas.changeFormData(songData);

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
			let songData = songDatasFromPython[urlsFromPython[songNumber]]['USA']
			this.songDatas.changeFormData(songData);
		} else {
			let songData = songDatasFromPython[urlsFromPython[songNumber]]['JPN']
			this.songDatas.changeFormData(songData);
		}
		
	}
	

	_addEvent() {
		this.DOM.menu.addEventListener("click", this.pageChange.bind(this));
		this.DOM.songs.addEventListener("click", this.songDataChange.bind(this));
		this.DOM.languageInputs.forEach(input => input.addEventListener("change", this.songDataLaungage.bind(this)));
		

	}
}

new menu();

class songDatas {
	constructor(urls, songDatasDict) {
		this.songDatasDict = songDatasDict;
		this.DOM = {};
		this.DOM.nameInput = document.querySelector('.song__name input');
		this.DOM.artistInput = document.querySelector('.song__artist input');
		this.DOM.albumInput = document.querySelector('.song__album input');
		this.DOM.categoryInput = document.querySelector('.song_category input');
		this.DOM.yearInput = document.querySelector('.song__year input');
		//フォームに最初に登録したURLの情報を表示しておく。
		const songDataEn1 = this.songDatasDict[urls[0]]['USA']
		this.changeFormData(songDataEn1);
		
	}

	changeFormData(songData) {
		console.log('ここ')
		console.log(songData)
		if(Object.keys(songData)){
			this.DOM.nameInput.value = songData['name'];
			this.DOM.artistInput.value = songData['artist'];
			this.DOM.albumInput.value = songData['album'];
			this.DOM.categoryInput.value = songData['category'];
			this.DOM.yearInput.value = songData['year'];
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