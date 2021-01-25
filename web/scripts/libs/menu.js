class menu {
	constructor() {
		this.DOM = {}
		this.DOM.menu = document.querySelector('.menu');
		this.DOM.Download = document.querySelector('.main');
		this.DOM.Tags = document.querySelector('.main2');
		this._addEvent();
	}

	chosePage(page) {
		const pageClass = this.DOM[page].classList;
		if(!pageClass.contains('activateP')){
			const activate = document.querySelector('.activateP')
			activate.classList.remove('activateP')
			pageClass.add('activateP');
		}
	}

	pageChange(elm) {
		let clickedElemnt = elm.target;
		if(clickedElemnt.tagName != 'UL') {
			if(clickedElemnt.tagName != 'LI') {
				clickedElemnt = clickedElemnt.closest('LI');
			}
			const menu = clickedElemnt.closest('.menu');
			const active = menu.querySelector('.active');
			active.classList.remove('active');
			clickedElemnt.classList.add('active');
			const page = clickedElemnt.textContent;
			this.chosePage(page);
			
		}
	}

	_addEvent() {
		this.DOM.menu.addEventListener("click", this.pageChange.bind(this));
	}
}

new menu();

eel.expose(addSongData)
function addSongData(songName, artist, album, category, year){
	let DOM = {}
	DOM.nameInput = document.querySelector('.song__name input')
	DOM.artistInput = document.querySelector('.song__artist input')
	DOM.albumInput = document.querySelector('.song__album input');
	DOM.categoryInput = document.querySelector('.song_category input');
	DOM.yearInput = document.querySelector('.song__year input');
	
	DOM.nameInput.value = songName
	DOM.artistInput.value = artist
	DOM.albumInput.value = album;
	DOM.categoryInput.value = category;
	DOM.yearInput.value = year;


}