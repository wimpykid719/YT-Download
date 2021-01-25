class thumbnail {
	constructor(){
		this.DOM = {}
		this.Flags = {}
		this.DOM.dlcards = document.querySelectorAll('.dlcard')
		this.DOM.dlcards.forEach((dlcard) => {
			const dlcardCover = dlcard.querySelector('.dlcard__thumbnail--cover');
			const thumbnailClassName = dlcardCover.classList[1];
			this.Flags[thumbnailClassName] = ''
		});
		this.CSS = document.querySelectorAll('link')[1].sheet;
		this.DOM.inputURL = document.querySelectorAll('.dlcard__url > input');
		this.DOM.dlcardWrap = document.querySelector(".dlcardWrap");
		this._addEvent();
	}

	async getTitle(input, dlcard) {
		let title = await eel.get_title(input.value)();
		dlcard.querySelector('.dlcard__title > .dlcard__videoName').innerText = title;
	}

	async getSrc(videoID, thumbnailIMG, dlcard, thumbnailClassName) {
		let url = await eel.get_src(videoID)();
		thumbnailIMG.src = url;
		this.loading(dlcard, thumbnailClassName)
	}

	getVideoID(input) {
		if (input.value.match(/^https:\/\/www\.youtube\.com\/watch\?v=.*/)) {
			const url = new URL(input.value)
			return url.searchParams.get('v');
		}else{
			return false;
		}
	}

	imgRGB(thumbnailIMG) {
		const thumbnailClassName = this.DOM.dlcardCover.classList[1];
		console.log(thumbnailClassName);
		const colorThief = new ColorThief();
		const thumColor = colorThief.getColor(thumbnailIMG.target);
		this.CSS.insertRule(`.${thumbnailClassName} {background: -webkit-gradient(linear, left top, left bottom, color-stop(40%, rgba(255, 255, 255, 0)), to(rgb(${thumColor[0]}, ${thumColor[1]}, ${thumColor[2]})));}`, this.CSS.cssRules.length);
		//.dlcard__thumbnail::after {background: -webkit-gradient(linear, left top, left bottom, color-stop(40%, rgba(255, 255, 255, 0)), to(rgb());}
	}

	loading(dlcard, thumbnailClassName) {
		console.log(dlcard.querySelector(`.${thumbnailClassName} > .donutSpinner`))
		dlcard.querySelector(`.${thumbnailClassName} > .donutSpinner`).classList.toggle('open');
	}

	changeTitleThumbnail(elm) {
		
		const input = elm.target;
		if (!input.parentElement.classList.contains("dlcard__url")) {
			console.log('dlcard_urlが取得出来ていないです。')
		}else{
			let videoID = this.getVideoID(input);
			let dlcard = input.closest('.dlcard');
			//imgRGBで使用する。
			this.DOM.dlcardCover = dlcard.querySelector('.dlcard__thumbnail--cover');
			const thumbnailClassName = this.DOM.dlcardCover.classList[1];
			let thumbnailIMG = dlcard.childNodes[3].childNodes[1];
			thumbnailIMG.addEventListener("load", this.imgRGB.bind(this), true);
			if(videoID) {
				//loadingを開始する。
				if (this.Flags[thumbnailClassName] != input.value){
					this.loading(dlcard, thumbnailClassName);
					this.getTitle(input, dlcard);
					this.getSrc(videoID, thumbnailIMG, dlcard, thumbnailClassName);
					this.Flags[thumbnailClassName] = input.value;
				}
			}else{
				input.value = '';
				input.placeholder = 'URLが違います。';
			}

		}
	}

	_addEvent() {
		this.params = {}
		this.DOM.dlcardWrap.addEventListener("blur", this.changeTitleThumbnail.bind(this), true);
	}
}

let thumbnailClass = new thumbnail();

//https://www.youtube.com/watch?v=f8Ttg4_7-oU&t=122s
//https://img.youtube.com/vi/youtube-video-id/maxresdefault.jpg
//youtube-video-id = f8Ttg4_7-oU