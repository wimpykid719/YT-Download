class menu {
	constructor() {
		this.DOM = {}
		this.DOM.header = document.querySelector('.header')
		this.DOM.headerCloseIcon = document.querySelector('.header__close');
		this.DOM.menu = document.querySelector('.menu');
		this.DOM.blurCover = document.querySelector('.blur-cover');
		this.DOM.menuMobile = document.querySelector('.main .menu-mobile');
		this.DOM.menuMobile2 = document.querySelector('.main2 .menu-mobile');

		this.DOM.Download = document.querySelector('.main');
		this.DOM.Tags = document.querySelector('.main2');
		this.DOM.numerator = document.querySelector('.numerator');
		this.DOM.title = document.querySelector('.datatitle__name');
		this.DOM.fraction = document.querySelector('.fraction');
		this.DOM.paginationPrevious = document.querySelector('.pagination__previous');
		this.DOM.paginationNext = document.querySelector('.pagination__next');
		this.DOM.songLanguage = document.querySelector('.song__language');
		this.DOM.languageSpans = document.querySelectorAll('.song__language > span');
		this.DOM.dummy = document.querySelector('.song__dummy');
		this.DOM.lyricArea = document.querySelector('.song__lyrics textarea');
		this.DOM.save = document.querySelector('.save__button');

		this._addEvent();
	}

	_LanguageChange() {
		if(!(Object.keys(this.songDatas).length == 0)){
			this.DOM.songLanguage.classList.add('ripple');
		window.setTimeout(function(){
			this.DOM.songLanguage.classList.remove('ripple');
		}.bind(this), 200);
		this.DOM.languageSpans.forEach((span) => {
			span.classList.toggle('checked');
		});
		this.DOM.languageSpanChecked = document.querySelector('.song__language > .checked');
		const contentSpan = this.DOM.languageSpanChecked.textContent;
		this.songDataLaungage(contentSpan);
		}
	}

	_toggle() {
		this.DOM.header.classList.toggle('open');
		this.DOM.blurCover.classList.toggle('visible');
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
			//エラーを回避するため
			this.songDatas = {}

			//辞書が空でもJSではTrue
			if(page == 'Tags' && !(urlsFromPython.length == 0) && !(Object.keys(songDatasFromPython).length == 0)) {
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
		let spans = this.DOM.languageSpans
		if(selectedValue == '1') {
			if(!spans[0].classList.contains('checked')){
				spans[0].classList.add('checked');
				spans[1].classList.remove('checked');
			}
			songData = this.songDatas.songDatasDict[this.songDatas.urls[pageNumber]]['USA']
		} else {
			if(!spans[1].classList.contains('checked')){
				spans[1].classList.add('checked');
				spans[0].classList.remove('checked');
			}
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

	songDataLaungage(Text) {
		let songNumber = this.currentPageNumber() - 1;
		let songData = {}
		if(Text == 'A') {
			songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['USA'];
			this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'] = '1'
		} else {
			songData = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['JPN'];
			this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'] = '2'
		}
		this.songDatas.changeFormData(songData);

		
	}

	getCurrentPageInfo() {
		const songNumber = this.currentPageNumber() - 1;
		//1なら日本語2なら英語
		const languageNumber = this.songDatas.songDatasDict[this.songDatas.urls[songNumber]]['language'];
		return {'songNumber': songNumber, 'languageNumber': languageNumber}
	}

	flexTextarea(elm) {
		this.DOM.dummy.textContent = elm.target.value + '\u200b'
	}

	writeSongData() {
		eel.write_song_data(this.songDatas.urls, this.songDatas.songDatasDict);
	}
	

	_addEvent() {
		this.DOM.menuMobile.addEventListener("click", this._toggle.bind(this));
		this.DOM.menuMobile2.addEventListener("click", this._toggle.bind(this));
		this.DOM.headerCloseIcon.addEventListener("click", this._toggle.bind(this));
		this.DOM.blurCover.addEventListener("click", this._toggle.bind(this));

		this.DOM.menu.addEventListener("click", this.pageChange.bind(this));
		this.DOM.paginationPrevious.addEventListener("click", this.previousPage.bind(this));
		this.DOM.paginationNext.addEventListener("click", this.nextPage.bind(this));
		this.DOM.songLanguage.addEventListener("click", this._LanguageChange.bind(this));
		this.DOM.lyricArea.addEventListener('input', this.flexTextarea.bind(this));
		this.DOM.save.addEventListener('click', this.writeSongData.bind(this));
		

	}
}

menuInsta = new menu();

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
		this.DOM.artworkInput = document.querySelector('.song__cover input');
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
		this._addEvent();
		
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

	updataInput(elm) {
		const parentDiv = elm.target.closest('div');
		const labelElm = parentDiv.querySelector('label');
		
		const currentPage = menuInsta.getCurrentPageInfo();
		console.log(currentPage);
		let language = '';
		if (currentPage['languageNumber'] == '1') {
			language = 'USA';
		} else {
			language = 'JPN';
		}
		let dictName = labelElm.className;
		this.songDatasDict[this.urls[currentPage['songNumber']]][language][dictName] = elm.target.value;
	}

	updataLyric(elm) {
		const parentDiv = elm.target.closest('.song__lyrics');
		const labelElm = parentDiv.querySelector('label');
		const currentPage = menuInsta.getCurrentPageInfo();
		let dictName = labelElm.className;
		this.songDatasDict[this.urls[currentPage['songNumber']]][dictName] = elm.target.value;
	}

	_addImageObject(elm) {
		const base64URL = elm.target.result;
		const base64 = base64URL.replace(/data:.*\/.*;base64,/, '');
		const currentPage = menuInsta.getCurrentPageInfo();
		this.songDatasDict[this.urls[currentPage['songNumber']]]['userImage'] = base64;
		console.log(this.songDatasDict); 
	}

	getImageFile(elm) {
		let file_reader = new FileReader();
		file_reader.addEventListener('load', this._addImageObject.bind(this));
		file_reader.readAsDataURL(elm.target.files[0]);
	}

	_addEvent() {
		this.DOM.nameInput.addEventListener('input', this.updataInput.bind(this));
		this.DOM.artistInput.addEventListener('input', this.updataInput.bind(this));
		this.DOM.albumInput.addEventListener('input', this.updataInput.bind(this));
		this.DOM.categoryInput.addEventListener('input', this.updataInput.bind(this));
		this.DOM.yearInput.addEventListener('input', this.updataInput.bind(this));
		this.DOM.artworkInput.addEventListener('change', this.getImageFile.bind(this));
		this.DOM.lyricArea.addEventListener('input', this.updataLyric.bind(this));
	}
}

let urlsFromPython = []
let songDatasFromPython = {}

//python側で動画のダウンロードが完了した時点で実行される。
eel.expose(addSongData)
function addSongData(urls, songDatas){
	urlsFromPython = urls;
	songDatasFromPython = songDatas;
}