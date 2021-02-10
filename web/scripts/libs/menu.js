class menu {
	constructor() {
		this.DOM = {}
		this.DOM.menu = document.querySelector('.menu');
		this.DOM.Download = document.querySelector('.main');
		this.DOM.Tags = document.querySelector('.main2');
		this.DOM.numerator = document.querySelector('.numerator');
		this.DOM.title = document.querySelector('.datatitle__name');
		this.DOM.fraction = document.querySelector('.fraction');
		this.DOM.paginationPrevious = document.querySelector('.pagination__previous');
		this.DOM.paginationNext = document.querySelector('.pagination__next');

		this.DOM.languageInputs = document.querySelectorAll('.language input[name="country"]')
		this.DOM.dummy = document.querySelector('.song__dummy');
		this.DOM.lyricArea = document.querySelector('.song__lyrics textarea');

		this._addEvent();
	}

	addZero(number) {
		let zeroNumber = '';
		if(number <= 10) {
			zeroNumber = '0' + String(number);
		}
		return zeroNumber
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
				const title = this.songDatas.songDatasDict[this.songDatas.urls[0]]['title']
				this.titleShow(title);
				this.DOM.numerator.innerHTML = '01';
				this.DOM.fraction.innerHTML = this.addZero(this.songDatas.urls.length);
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

	titleShow(title) {
		this.DOM.title.innerHTML = title;
		
	}

	currentPageNumber() {
		let numberStr = this.DOM.numerator.textContent;
		if(numberStr.slice(0) == '0') {
			numberStr = numberStr.slice(-1);
		}
		return Number(numberStr)
	}

	songPageChange(pageNumber) {
		let selectedValue = this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['language']
		const title = this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['title']
		let songData = {}
		if(selectedValue == '1') {
			let EN = document.querySelector('#EN');
			EN.checked = true;
			songData = this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['USA']
		} else {
			let JPN = document.querySelector('#JPN');
			JPN.checked = true;
			songData = this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['JPN']
		}
		this.titleShow(title);
		this.songDatas.changeFormData(songData);
		this.songDatas.changeArtwork(this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['artwork_path'])
		this.songDatas.changeLyric(this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['lyric'])
	}

	nextPage() {
		const urlsAmount = this.songDatas.urls.length;
		const pageNumber = this.currentPageNumber();
		const nextPageNumber = pageNumber + 1;
		if (pageNumber < urlsAmount) {
			this.songPageChange(pageNumber);
			this.DOM.numerator.innerHTML = this.addZero(nextPageNumber);
		}
	}

	previousPage() {
		const pageNumber = this.currentPageNumber();
		const previousPageNumber = pageNumber - 1;
		if(!(pageNumber <= 1)) {
			this.songPageChange(pageNumber - 2);
			this.DOM.numerator.innerHTML = this.addZero(previousPageNumber);
		}
	}

	songDataLaungage(elm) {
		let songNumber = this.currentPageNumber() - 1;
		let changedElemt = elm.target;
		let songData = {}
		if(changedElemt.value == '1') {
			songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['USA'];
			this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'] = '1'
		} else {
			songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['JPN'];
			this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'] = '2'
		}
		this.songDatas.changeFormData(songData);

		
	}

	flexTextarea(elm) {
		this.DOM.dummy.textContent = elm.target.value + '\u200b'
	}
	

	_addEvent() {
		this.DOM.menu.addEventListener("click", this.pageChange.bind(this));
		this.DOM.paginationPrevious.addEventListener("click", this.previousPage.bind(this));
		this.DOM.paginationNext.addEventListener("click", this.nextPage.bind(this));
		this.DOM.languageInputs.forEach(input => input.addEventListener("change", this.songDataLaungage.bind(this)));
		this.DOM.lyricArea.addEventListener('input', this.flexTextarea.bind(this))
		

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
		this.DOM.artworkImg = document.querySelector('.song__cover > img');
		this.DOM.lyricArea = document.querySelector('.song__lyrics textarea');
		this.DOM.dummy = document.querySelector('.song__dummy');
		

		//フォームに最初に登録したURLの情報を表示しておく。
		//ここでエラーが出ることがあったタイミングの問題か？？？
		//URLが原因だった。
		const songDataEn1 = this.songDatasDict[this.urls[0]]['USA']
		this.urls.forEach( url => {
			this.songDatasDict[url]['language'] = '1'
		});
		this.changeFormData(songDataEn1);
		this.changeArtwork(this.songDatasDict[this.urls[0]]['artwork_path']);
		this.changeLyric(this.songDatasDict[this.urls[0]]['lyric'])
		
	}

	changeArtwork(path) {
		this.DOM.artworkImg.src = path;
	}

	changeLyric(lyric) {
		if(lyric.length >= 0){
			this.DOM.dummy.textContent = lyric + '\u200b';
			this.DOM.lyricArea.value = lyric;
		}
	}


	changeFormData(songData) {
		if(!(Object.keys(songData).length == 0)){
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