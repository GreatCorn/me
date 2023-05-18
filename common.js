var night = false;
var nests;
var navbar;

const banners = [	"auroraNova",
					"bitonicOverflow",
					"bleaks",
					"catDinner",
					"dreath",
					"kurlykistan",
					"peccata",
					"symphony1",
					"symphony3",
					"torpor"];
var banner;
var bannerIndex = -1;
var images = [];
var switchTimer;

function Start(){
	document.body.innerHTML = '<DIV id=navbar class=NavBar><A href="/me/"><IMG id=homePageImg style="left: 0; position: absolute; filter: invert(0);" src="/me/banner.png"></A><A href="/me/about/" class=NavBarLink>ABOUT</A><DIV class=VR></DIV><A href="/me/work/" class=NavBarLink>MY WORK</A><DIV class=VR></DIV><A href="/me/friends/" class=NavBarLink>FRIENDS</A><DIV class=VR></DIV><A href="/me/contacts/" class=NavBarLink>CONTACTS</A><IMG id=nightModeImg style="right: 0; position: absolute" src="/me/night.png" onclick=NightMode()></DIV><DIV class=Content>'+document.body.innerHTML+'</DIV><HR id=LicenseClaim><SMALL>The work presented on this site has individual license per piece. The licenses are presented on the work pages. The content licensed under the GreatCorn name refers to copyright being held by Yevhenii Ionenko. The text information on this site is licensed under a Commons Attribution 4.0 International License. © Yevhenii Ionenko (aka GreatCorn), 2020-2023<BR>The website is work-in-progress.</SMALL>';
	navbar = document.getElementById("navbar");
	
	FormContent();
	
	document.addEventListener("click", function(e){
		var el = e.target;
		while (el && !el.href)
			el = el.parentNode;
		
		if (el && el.href.indexOf("/me/") != -1){
			if (el.href == location.href){
				location.reload();
				return;
			}
			let extension = el.href.split('.').pop();
			if (["7z", "jpg", "mp3", "pdf", "png", "rar", "wav", "zip"].indexOf(extension) != -1)
				return;
			e.preventDefault();
			dispatchEvent(new Event("beforeunload"));
			history.pushState(null, null, el.href);
			ChangePage();
			return;
		}
	});
	window.addEventListener("resize", function(){
		Resize();
	});
	Resize();
	window.addEventListener('popstate', ChangePage);
	
	window.onbeforeunload = function (){
		for (i = 0; i < nests.length; i++) {
			//console.log("SAVING", nests[i].menuOpen);
			sessionStorage.setItem(location.pathname+"nest"+i.toString(), nests[i].menuOpen);
		}
	}
	
	if ((GetCookie("nightMode", "false") == "true") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))
		NightMode(true);
	
	if (location.href.indexOf("#") != -1)
		window.scrollTo({
			top: document.getElementById(location.href.substr(location.href.indexOf("#")+1)).offsetTop,
			behavior: "smooth"
		});
	
	//FORM BANNER
	if (document.getElementsByClassName("BannerWrapper").length > 0)
		LoadBanner();
	
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
		NightMode(e.matches);
	});
}
function Resize(){
	let prevlist = document.getElementsByClassName("preview");
	let preview = prevlist[prevlist.length-1];
	let description = document.getElementById("description");
	if (description){
		if (window.innerHeight > window.innerWidth){
			console.log("Portrait orientation");
			preview.style.width = "100%";
			preview.style.boxShadow = "0 8px 8px -8px black";
			preview.children[0].style.maxHeight = window.innerHeight-72;
			description.style.width = "99%";
			let recent = document.getElementsByClassName("Recent");
			for (i=0; i<recent.length; i++)
				recent[i].style.textAlign = "center";
		}
		else{
			console.log("Landscape orientation");
			preview.style.width = "calc(45% - 12px)";
			preview.style.boxShadow = "none";
			preview.children[0].style.maxHeight = "unset";
			description.style.width = "calc(55% - 12px)";
			let recent = document.getElementsByClassName("Recent");
			for (i=0; i<recent.length; i++)
				recent[i].style.textAlign = "left";
		}
	}
	if (window.innerWidth < 828)
		document.getElementById("homePageImg").src = "/me/bannerCorn.png"
}
function LoadPage(url, done){
	var loading;
	var loadWait = setTimeout(function(){
		loading = document.createElement("div");
		loading.className = "Loading";
		loading.animate({opacity: [0, 1]}, 200);
		document.body.appendChild(loading);
	}, 500);
	//return fetch(url, {method: 'GET'}).then(function(response){return response.text();});
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", url, true);
	rawFile.onload = function ()
	{
		done(rawFile.responseText);
		clearTimeout(loadWait);
		if (loading){
			let fadeout = loading.animate({opacity: [1, 0]}, 200);
			fadeout.onfinish = function (){
				loading.remove();
			}
		}
	}
	rawFile.send(null);
}
function ChangePage(){
	LoadPage(window.location.href, function(responseText) {
		let preview = document.getElementById("preview");
		if (preview)
			preview.id = "";
		preview = document.getElementById("description");
		if (preview)
			preview.id = "";
		let modal = document.getElementsByClassName("Modal");
		for (i=0; i<modal.length; i++)
			modal[i].remove();
		var wrapper = document.createElement('div');
		wrapper.className = "Content";
		wrapper.style.position = "absolute";
		wrapper.style.top = "0"; wrapper.style.left = "0";
		wrapper.innerHTML = responseText;
		document.title = wrapper.getElementsByTagName("TITLE")[0].innerText;
		var oldContent = document.querySelector(".Content");
		document.body.insertBefore(wrapper, document.getElementById("LicenseClaim"));
		FormContent();
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
		let mh = oldContent.innerHeight;
		let nh = wrapper.innerHeight;
		oldContent.animate({opacity: [1, 0]}, 400);
		var fadein = wrapper.animate({opacity: [0, 1]}, 400);
		fadein.onfinish = function (){
			wrapper.style.position = "relative";
			oldContent.remove();
			if (location.href.indexOf("#") != -1)
				window.scrollTo({
					top: document.getElementById(location.href.substr(location.href.indexOf("#")+1)).offsetTop,
					behavior: "smooth"
				});
		}
		//FORM BANNER
		console.log(wrapper.getElementsByClassName("BannerWrapper"));
		if (wrapper.getElementsByClassName("BannerWrapper").length > 0)
			LoadBanner();
		//UNFORM BANNER
		if (oldContent.getElementsByClassName("BannerWrapper").length > 0)
			UnloadBanner();
	});
}
function FormContent(){
	//PREVIEW SAME HEIGHT
	var preview = document.getElementById("preview");
	if (preview){
		preview.height = document.getElementById("description").offsetHeight;
	}
	//FORM NESTED MENUS
	nests = document.getElementsByClassName("MenuClick");
	for (i = 0; i < nests.length; i++) {
		nests[i].menuOpen = false;
		nests[i].addEventListener("click", function() {
			this.menuOpen = !this.menuOpen;
			if (this.menuOpen){
				this.parentElement.querySelector(".Nested").style.maxHeight = "64em";
				this.parentElement.querySelector(".Arrow").style.transform = "rotate(90deg)";
			}
			else{
				this.parentElement.querySelector(".Nested").style.maxHeight = "0";
				this.parentElement.querySelector(".Arrow").style.transform = "rotate(0deg)";
			}
		});
	}
	var openNest;
	//OPEN NESTS
	for (i = 0; i < nests.length; i++) {
		openNest = sessionStorage.getItem(location.pathname+"nest"+i.toString());
		//console.log("LOADING", openNest);
		if (openNest == "true"){
			nests[i].dispatchEvent(new Event("click"));
		}
	}
	//FORM PICTURES
	var toggler = document.getElementsByClassName("Picture");
	if (toggler.length > 0){
		var modal = document.createElement("div");
		modal.className = "Modal";
		modal.onclick = function(){
			let fadeout = modal.animate({opacity: [1, 0]}, 50);
			fadeout.onfinish = function (){
				modal.style.display = "none";
			}
		}
		document.body.appendChild(modal);
		var modalHelper = document.createElement("span");
		modalHelper.className = "ModalHelper";
		modal.appendChild(modalHelper);
		var modalIMG = document.createElement("img");
		modalIMG.className = "ModalContent";
		modalIMG.onclick = function(){window.open(this.src, "_blank");}
		modal.appendChild(modalIMG);
		for (i = 0; i < toggler.length; i++) {
			toggler[i].addEventListener("click", function() {
				modal.style.display = "block";
				modalIMG.src = this.src;
				//modal.style.opacity = "0";
				modal.animate({opacity: [0, 1]}, 50);
			});
		}
	}
	Resize();
	//FORM SORTERS
	toggler = document.getElementsByClassName("TableSorter");
	for (i = 0; i < toggler.length; i++) {
		toggler[i].asc = false;
		toggler[i].addEventListener("click", function() {
			this.asc = !this.asc;
			SortTable(this.parentElement.parentElement.parentElement, Array.prototype.indexOf.call(this.parentNode.children, this), this.asc);
		});
	}
	if (night) {
		NightMode(true);
	}
	//FORM NUMBERED CONTAINERS
	num = document.getElementsByClassName("Numbered");
	for (i=0; i<num.length; ++i)
		num[i].innerHTML += " ("+(num[i].parentNode.lastElementChild.firstElementChild.firstElementChild.children.length-1).toString()+")"; //bruh
}

function NightMode(mode) {
	if (mode == undefined)
		night = !night;
	else
		night = mode;
	if (night){
		/*var filter = document.createElement("div");
		filter.className = "Night";
		filter.innerHTML = document.body.innerHTML;
		document.body.innerHTML = "";
		document.body.appendChild(filter);
		document.body.appendChild(document.getElementById("navbar"));
		document.body.style.backgroundColor = "#1E1F21";*/
		navbar.style.filter = "invert(100%)";
		document.body.className = "Night";
		let objs = document.getElementsByClassName("Activity");
		for (i=0; i<objs.length; i++){
			objs[i].className = "NavBarLink Activity ActivityNight";
			objs[i].style.color = "#DEDFE1";
		}
		objs = document.getElementsByClassName("Menu");
		for (i=0; i<objs.length; i++)
			objs[i].style.background = "linear-gradient(0deg, black, #111216)";
		SetCookie("nightMode", "true", 365);
	}
	else{
		/*document.body.innerHTML = document.body.children[0].innerHTML;
		document.getElementById("navbar").style.marginTop = "0px";
		document.body.style.backgroundColor = "#EFEDE8";*/
		navbar.style.filter = "";
		document.body.className = "";
		let objs = document.getElementsByClassName("Activity");
		for (i=0; i<objs.length; i++){
			objs[i].className = "NavBarLink Activity";
			objs[i].style.color = "";
		}
		objs = document.getElementsByClassName("Menu");
		for (i=0; i<objs.length; i++)
			objs[i].style.background = "";
		SetCookie("nightMode", "false");
	}
}

function SortTable(table, n, asc) {
	console.log("Sort", n, asc);
	var rows, switching, i, x, y, shouldSwitch;
	switching = true;
	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			if (asc){
				if (x.innerText.toLowerCase() > y.innerText.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			}
			else{
				if (x.innerText.toLowerCase() < y.innerText.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
	}
}

function SetCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Lax";
}
function GetCookie(cname, cdefault) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	SetCookie(cname, cdefault, 365);
	return cdefault;
}

function LoadBanner(){
	banner = document.getElementById("Banner");
	Shuffle(banners);
	for (let i = 0; i < banners.length; ++i){
		let image = document.createElement("img");
		image.className = "Banner";
		image.src = "/me/banner/"+banners[i]+".jpg";
		banner.prepend(image);
		images.push(image);
	}
	SwitchBanner();
	
	console.log("Loaded banner.");
}
function UnloadBanner(){
	bannerIndex = -1;
	images = [];
	clearTimeout(switchTimer);
	
	console.log("Unloaded banner.");
}
function SwitchBanner(previous){
	if (previous == null)
		previous = false;
	if (!previous){
		++bannerIndex;
		if (bannerIndex >= images.length)
			bannerIndex = 0;
	}
	else{
		--bannerIndex;
		if (bannerIndex < 0)
			bannerIndex = images.length-1;
	}
	for (let i = 0; i < images.length; ++i){
		if (i == bannerIndex)
			images[i].style.opacity = 1;
		else
			images[i].style.opacity = 0;
	}
	banner.href = "/me/work/"+banners[bannerIndex]+".html";
	if (banners[bannerIndex] == "kurlykistan")
		banner.href = "/me/work/kurlykistan/";
	clearTimeout(switchTimer);
	switchTimer = setTimeout(SwitchBanner, 5000);
}
function Shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}