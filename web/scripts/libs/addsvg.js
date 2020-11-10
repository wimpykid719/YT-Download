const svgAll = svgs.returnAll()

function addElement () { 
	// 新しい div 要素を作成します 
	let newDiv = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 
	newDiv.setAttribute('class', 'svgAll');
	// いくつかの内容を与えます 
	newDiv.innerHTML = svgAll; 
	// テキストノードを新規作成した div に追加します
	//newDiv.appendChild(newDiv);
	const globalContainer = document.querySelector('#global-container')[0];
	document.body.insertBefore(newDiv, globalContainer);
}

	
document.addEventListener('DOMContentLoaded', addElement);