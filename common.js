var night = false;
var nests;
var navbar;

function Start(){
	document.body.innerHTML = '<DIV id=navbar class=NavBar><A href="/me/"><IMG id=homePageImg style="left: 0; position: absolute; filter: invert(0);" src="/me/banner.png"></A><A href="/me/about/" class=NavBarLink>ABOUT</A><DIV class=VR></DIV><A href="/me/work/" class=NavBarLink>MY WORK</A><DIV class=VR></DIV><A href="/me/friends.html" class=NavBarLink>FRIENDS</A><DIV class=VR></DIV><A href="/me/contacts/" class=NavBarLink>CONTACTS</A><IMG id=nightModeImg style="right: 0; position: absolute" src="/me/night.png" onclick=NightMode()></DIV><DIV class=Content>'+document.body.innerHTML+'</DIV><HR id=LicenseClaim><SMALL>The work presented on this site has individual license per piece. The licenses are presented on the work pages. The content licensed under the GreatCorn name refers to copyright being held by Yevhenii Ionenko. The text information on this site is licensed under a Commons Attribution 4.0 International License. © Yevhenii Ionenko (aka GreatCorn), 2020<BR>The website is work-in-progress.</SMALL>';
	navbar = document.getElementById("navbar");
	
	FormContent();
	
	document.addEventListener("click", function(e){
		var el = e.target;
		while (el && !el.href)
			el = el.parentNode;
		
		if (el && el.host === location.host){
			if (el.href == location.href){
				location.reload();
				return;
			}
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
	
	if (window.innerWidth < 828)
		document.getElementById("homePageImg").src = "/me/bannerCorn.png"
	
	window.onbeforeunload = function (){
		for (i = 0; i < nests.length; i++) {
			//console.log("SAVING", nests[i].menuOpen);
			localStorage.setItem(location.pathname+"nest"+i.toString(), nests[i].menuOpen);
		}
	}
	
	if (GetCookie("nightMode", "false") == "true")
		NightMode(true);
}
function Resize(){
	let prevlist = document.getElementsByClassName("preview");
	let preview = prevlist[prevlist.length-1];
	let description = document.getElementById("description");
	if (description){
		if (window.innerHeight > window.innerWidth){
			console.log("Portrait orientation");
			preview.style.width = "100%";
			preview.children[0].height = window.innerHeight-72;
			description.style.width = "99%";
		}
		else{
			console.log("Landscape orientation");
			preview.style.width = "calc(45% - 12px)";
			preview.children[0].height = document.getElementById("description").offsetHeight;
			description.style.width = "calc(55% - 12px)";
		}
	}
}
function LoadPage(url){
	return fetch(url, {method: 'GET'}).then(function(response){return response.text();});
}
function ChangePage(){
	LoadPage(window.location.href).then(function(responseText) {
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
			var openNest;
			//OPEN NESTS
			for (i = 0; i < nests.length; i++) {
				openNest = localStorage.getItem(location.pathname+"nest"+i.toString());
				//console.log("LOADING", openNest);
				if (openNest == "true"){
					nests[i].dispatchEvent(new Event("click"));
				}
			}
		}
	})
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
	//FORM PICTURES
	var toggler = document.getElementsByClassName("Picture");
	if (toggler.length > 0){
		var modal = document.createElement("div");
		modal.className = "Modal";
		modal.onclick = function(){this.style.display = "none";}
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
				modal.style.opacity = "0";
				setTimeout(function(){modal.style.opacity = "1";}, 50);
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