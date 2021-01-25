class thumbnail {
	constructor(){
		
		this.DOM = {}
		this.DOM.inputURL = document.querySelectorAll('.dlcard__url > input');
		this.DOM.dlcardWrap = document.querySelector(".dlcardWrap");
		this._addEvent();
	}


	_addEvent() {
		this.params = {}
		this.DOM.dlcardWrap.addEventListener("blur", 
			function (elm) {
				const input = elm.target;
				if (input.parentElement.classList.contains("dlcard__url")) {
					if (input.value.match(/^https:\/\/www\.youtube\.com\/watch\?v=.*/)) {
						const url = new URL(input.value)
						let pairs = url.search.substring(1).split('&');
						let params = {}
						for(let pair of pairs) {
							let kv = pair.split('=');
							params[kv[0]] = kv[1];
						}
						let videoID = params.v;
						let dlcard = input.closest('.dlcard');
						let thumbnailIMG = dlcard.childNodes[3].childNodes[1];
						if(videoID) {
							async function run() {
								let title = await eel.get_title(input.value)();
								dlcard.querySelector('.dlcard__title > .dlcard__videoName').innerText = title;
							}
							run();

							async function getSrc() {
								let url = await eel.get_src(videoID)();
								thumbnailIMG.src = url;
							}
							getSrc();
							
							
						}
					}else{
						input.value = '';
						input.placeholder = 'URLが違います。';
					}
				}else{
					console.log('dlcard_urlが取得出来ていないです。')
				}
			}, true);
	}
}

new thumbnail();