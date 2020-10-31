function Start(){
	document.body.innerHTML = '<DIV id=navbar class=NavBar><A href="/me"><IMG id=homePageImg style="left: 0; position: absolute;" src="/me/banner.png"></A><A href="/me/about" class=NavBarLink>ABOUT</A><DIV class=VR></DIV><A href="/me/work" class=NavBarLink>MY WORK</A><DIV class=VR></DIV><A href="/me/friends" class=NavBarLink>FRIENDS</A><DIV class=VR></DIV><A href="/me/contacts" class=NavBarLink>CONTACTS</A></DIV><DIV class=Content>'+document.body.innerHTML+'</DIV><HR><SMALL>The work presented on this site has individual license per piece. The licenses are presented on the work pages.</SMALL>';
	/*var navBar = document.createElement('div');
	navBar.className = 'NavBar';
	document.body.appendChild(navBar);
	*/
	if (window.innerWidth < 828)
		document.getElementById("homePageImg").src = "/me/bannerCorn.png"
	var preview = document.getElementById("preview");
	if (preview){
		preview.height = document.getElementById("description").offsetHeight;
	}
	var toggler = document.getElementsByClassName("MenuClick");
	for (i = 0; i < toggler.length; i++) {
		toggler[i].menuOpen = false;
		toggler[i].addEventListener("click", function() {
			this.menuOpen = !this.menuOpen;
			if (this.menuOpen){
				this.parentElement.querySelector(".Nested").style.maxHeight = "200%";
				this.parentElement.querySelector(".Arrow").style.transform = "rotate(90deg)";
			}
			else{
				this.parentElement.querySelector(".Nested").style.maxHeight = "0%";
				this.parentElement.querySelector(".Arrow").style.transform = "rotate(0deg)";
			}
		});
	}
	toggler = document.getElementsByClassName("Picture");
	if (toggler.length > 0){
		var modal = document.createElement("div");
		modal.className = "Modal";
		modal.onclick = function(){this.style.display = "none";}
		document.body.appendChild(modal);
		var modalIMG = document.createElement("img");
		modalIMG.className = "ModalContent";
		modalIMG.onclick = function(){window.open(this.src, "_blank");}
		modal.appendChild(modalIMG);
		for (i = 0; i < toggler.length; i++) {
			toggler[i].addEventListener("click", function() {
				modal.style.display = "block";
				modalIMG.src = this.src;
			});
		}
	}
}