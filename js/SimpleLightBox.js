/** @version 1.0.0 */
// https://gist.github.com/1pxsun/a098d2c92749dfb83abc

"use strict";

function SimpleLightBox(opt) {
	var prefix = "SimpleLightBox";
	var images = opt.images || [];
	var current = opt.start || 0;
	var activeClass = opt.activeClass || prefix+"Active";
	var imageElements = [];
	var self = this;
	var html = ('<div class="@Arrow @Left"></div>'
	+ '<div class="@Arrow @Right"></div>'
	+ '<div class="@Close"></div><style>'
	+ '#@ { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 100; background: rgba(0, 0, 0, 0.9); opacity: 0; transition: opacity .2s }'
	+ '#@.@Open { opacity: 1 }'
	+ '#@ > div > div { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none }'
	+ '#@ img { ' + ('objectFit' in document.body.style ? 'width: 100%; height: 100%; object-fit: contain' : 'width: auto; height: 100%') + '; max-height: 100vh}'
	+ '#@ .@Image { width: 100%; height: 100%; position: absolute; opacity: 0; transition: opacity .2s; display: flex; justify-content: center }'
	+ '#@ .@Active { opacity: 1 }'
	+ (images.length > 1 ? '#@ .@Arrow { position: absolute; top: 0; width: 50px; height: 100%; color: white; cursor: pointer; z-index: 101; opacity: .4; transition: opacity .1s }'
	+ '#@ .@Arrow:hover { opacity: 1 }'
	+ '#@ .@Arrow:after { position: absolute; top: 50%; font-size: 30px; font-family: serif; padding: 20px; transform: translate(0,-50%) scaleY(2) }' : '')
	+ '#@ .@Close:after { opacity: .4; transition: opacity .1s; font-size: 30px; color: white; position: absolute; right: 16px; content: "✕"; z-index: 102; cursor: pointer; line-height: 1.6 }'
	+ '#@ .@Close:hover:after { opacity: 1 }'
	+ '#@ .@Left { left: 0 }'
	+ '#@ .@Left:after { content: "<" }'
	+ '#@ .@Right { right: 0; left: auto }'
	+ '#@ .@Right:after { right: 0; content: ">" }'
	+ '<style>').replace(/@/g, prefix);
	function keyHandler(ev) {
		if (ev.keyCode == 27) self.close();
		else if ([37, 8, 33, 75].indexOf(ev.keyCode) + 1) self.prev();
		else if ([39, 32, 34, 74].indexOf(ev.keyCode) + 1) self.next();
		else return;
		ev.preventDefault();
	}
	function onSwipe(el, dir, cb, w, x, y, z) {
		for (y in {touchstart: 0, touchmove: 0})
			el.addEventListener(y, function(ev) {
				w = ev.changedTouches[0];
				ev.type[5]=="m" && !ev.preventDefault() && x
					&& dir[0] == "l" == z > 0
					&& Math.abs(x[0] - w.pageX) > 42
					&& (x = 0 || cb());
				ev.type[5]=="s" && (x = [w.pageX, w.pageY]);
			});
	}
	this.show = function(index) {
		var count = images.length;
		index = (index + count) % count;
		for (var i = 0; i < count; i++) {
			imageElements[i] && imageElements[i].classList.remove(activeClass);
		}
		imageElements[index] && imageElements[index].classList.add(activeClass);
		current = index;
	};
	this.open = function() {
		self.close();
		var el = document.createElement("div");
		el.setAttribute("id", prefix);
		el.innerHTML = html;
		var slides = document.createElement("div");
		for (var i = 0; i < images.length; i++) {
			var slide = document.createElement("img");
			slide.setAttribute("src", images[i]);
			var slideEl = document.createElement("div");
			slideEl.className = prefix + "Image";
			slideEl.appendChild(slide);
			slides.appendChild(slideEl);
		}
		el.appendChild(slides);
		imageElements = [];
		for (i = 0; i < slides.children.length; i++) {
			imageElements.push(slides.children[i]);
		}

		el.querySelector("." + prefix + "Left").addEventListener("click", self.prev);
		el.querySelector("." + prefix + "Right").addEventListener("click", self.next);
		el.querySelector("." + prefix + "Close").addEventListener("click", self.close);
		el.addEventListener("click", self.close);
		onSwipe(el, "left", self.next);
		onSwipe(el, "right", self.prev);
		window.addEventListener("keydown", keyHandler);
		document.body.appendChild(el);
		setTimeout(function(){ el.className = prefix+"Open" }, 100);
		this.show(current);
	};
	this.close = function() {
		var el = document.getElementById(prefix);
		if (!el) return;
		window.removeEventListener("keydown", keyHandler);
		el.className = "";
		setTimeout(function () {
			if (el.parentNode) el.parentNode.removeChild(el);
		}, 100);
	}

	this.next = function(ev) { ev && ev.stopPropagation(); self.show(current + 1); };
	this.prev = function(ev) { ev && ev.stopPropagation(); self.show(current - 1); };
}

SimpleLightBox.closest = function(el, attr) {
	do {
		if (el && el.getAttribute && el.getAttribute(attr) !== null) {
			return el;
		}
	} while (el = el.parentNode);
}

SimpleLightBox.register = function() {
	document.addEventListener("click", function(ev) {
		var link = SimpleLightBox.closest(ev.target, "data-lightbox");
		if (link) {
			var name = link.getAttribute("data-lightbox");
			ev.preventDefault();
			var links = document.querySelectorAll('*[data-lightbox="'+name+'"]');
			var start = [].indexOf.call(links, link);
			var images = [];
			for (var i = 0; i < links.length; i++) {
				var url = links[i].getAttribute("href") || links[i].getAttribute("src");
				images.push(url);
			}
			var box = new SimpleLightBox({images: images, start: start})
			box.open();
		}
	})
}

SimpleLightBox.register();
