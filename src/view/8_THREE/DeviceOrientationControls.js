var DeviceOrientationController = function(e, t) {
	this.object = e, this.element = t || document, this.freeze = !0, this.enableManualDrag = !0, this.enableManualZoom = !0, this.deviceOrientationManual = !1, this.useQuaternions = !0, this.deviceOrientation = {}, this.screenOrientation = window.orientation || 0, this.manualDragDirection = -1;
	var i, r, n, o, a, s = 0,
		l = 0,
		h = 0,
		c = 0,
		u = new THREE.Quaternion,
		p = 1,
		d = 1,
		f = new THREE.Vector2,
		m = new THREE.Vector2,
		E = {
			AUTO: 0,
			MANUAL_ROTATE: 1,
			MANUAL_ZOOM: 2
		},
		g = E.AUTO,
		v = {
			CALIBRATE_COMPASS: "compassneedscalibration",
			SCREEN_ORIENTATION: "orientationchange",
			MANUAL_CONTROL: "userinteraction",
			ZOOM_CONTROL: "zoom",
			ROTATE_CONTROL: "rotate"
		},
		y = window.innerHeight,
		T = 2e3 * Math.tan(THREE.Math.degToRad((this.object.fov || 75) / 2)),
		x = new THREE.Quaternion,
		R = function() {
			var e;
			return function(t) {
				e = arguments || {}, e.type = t, e.target = this, this.dispatchEvent(e)
			}.bind(this)
		}.bind(this)();
	this.constrainObjectFOV = function() {
		o = T * (window.innerHeight / y), a = THREE.Math.radToDeg(2 * Math.atan(o / 2e3)), this.object.fov = a
	}.bind(this), this.onDeviceOrientationChange = function(e) {
		this.deviceOrientationManual === !0 && (this.deviceOrientation = e)
	}.bind(this), this.onScreenOrientationChange = function() {
		this.deviceOrientationManual === !0 && (this.screenOrientation = window.orientation || 0, R(v.SCREEN_ORIENTATION))
	}.bind(this), this.onCompassNeedsCalibration = function(e) {
		this.deviceOrientationManual === !0 && (e.preventDefault(), R(v.CALIBRATE_COMPASS))
	}.bind(this), this.onDocumentMouseDown = function(e) {
		this.enableManualDrag === !0 && (e.preventDefault(), g = E.MANUAL_ROTATE, this.freeze = !0, u.copy(this.object.quaternion), s = h = e.pageX, l = c = e.pageY, i = 1200 / window.innerWidth * .2, r = 800 / window.innerHeight * .2, this.element.addEventListener("mousemove", this.onDocumentMouseMove, !1), this.element.addEventListener("mouseup", this.onDocumentMouseUp, !1), R(v.MANUAL_CONTROL + "start"), R(v.ROTATE_CONTROL + "start"))
	}.bind(this), this.onDocumentMouseMove = function(e) {
		h = e.pageX, c = e.pageY;
	}.bind(this), this.onDocumentMouseUp = function(e) {
		this.element.removeEventListener("mousemove", this.onDocumentMouseMove, !1), this.element.removeEventListener("mouseup", this.onDocumentMouseUp, !1), g = E.AUTO, this.freeze = !1, R(v.MANUAL_CONTROL + "end"), R(v.ROTATE_CONTROL + "end")
	}.bind(this), this.onDocumentTouchStart = function(e) {
		switch (e.preventDefault(), e.touches.length) {
			case 1:
				if (this.enableManualDrag !== !0) return;
				g = E.MANUAL_ROTATE, this.freeze = !0, u.copy(this.object.quaternion), s = h = e.touches[0].pageX, l = c = e.touches[0].pageY, i = 1200 / window.innerWidth * .1, r = 800 / window.innerHeight * .1, this.element.addEventListener("touchmove", this.onDocumentTouchMove, !1), this.element.addEventListener("touchend", this.onDocumentTouchEnd, !1), R(v.MANUAL_CONTROL + "start"), R(v.ROTATE_CONTROL + "start");
				break;
			case 2:
				if (this.enableManualZoom !== !0) return;
				g = E.MANUAL_ZOOM, this.freeze = !0, n = this.object.fov, f.set(e.touches[0].pageX, e.touches[0].pageY), m.set(e.touches[1].pageX, e.touches[1].pageY), p = d = f.distanceTo(m), this.element.addEventListener("touchmove", this.onDocumentTouchMove, !1), this.element.addEventListener("touchend", this.onDocumentTouchEnd, !1), R(v.MANUAL_CONTROL + "start"), R(v.ZOOM_CONTROL + "start")
		}
	}.bind(this), this.onDocumentTouchMove = function(e) {
		switch (e.touches.length) {
			case 1:
				h = e.touches[0].pageX, c = e.touches[0].pageY;
				break;
			case 2:
				f.set(e.touches[0].pageX, e.touches[0].pageY), m.set(e.touches[1].pageX, e.touches[1].pageY)
		}
	}.bind(this), this.onDocumentTouchEnd = function(e) {
		this.element.removeEventListener("touchmove", this.onDocumentTouchMove, !1), this.element.removeEventListener("touchend", this.onDocumentTouchEnd, !1), g === E.MANUAL_ROTATE ? (g = E.AUTO, this.freeze = !1, R(v.MANUAL_CONTROL + "end"), R(v.ROTATE_CONTROL + "end")) : g === E.MANUAL_ZOOM && (this.constrainObjectFOV(), g = E.AUTO, this.freeze = !1, R(v.MANUAL_CONTROL + "end"), R(v.ZOOM_CONTROL + "end"))
	}.bind(this);
	var b = function() {
			var e = new THREE.Quaternion,
				t = new THREE.Euler,
				i = new THREE.Quaternion,
				r = new THREE.Quaternion(-Math.sqrt(.5), 0, 0, Math.sqrt(.5)),
				n = 0;
			return function(o, a, s, l) {
				return t.set(a, o, -s, "YXZ"), e.setFromEuler(t), n = -l / 2, i.set(0, Math.sin(n), 0, Math.cos(n)), e.multiply(i), e.multiply(r), e
			}
		}(),
		H = function() {
			var e = new THREE.Matrix4,
				t = new THREE.Euler,
				i = new THREE.Euler,
				r = new THREE.Euler(-Math.PI / 2, 0, 0, "YXZ"),
				n = new THREE.Matrix4,
				o = new THREE.Matrix4;
			return o.makeRotationFromEuler(r),
				function(r, a, s, l) {
					return t.set(a, r, -s, "YXZ"), e.identity(), e.makeRotationFromEuler(t), i.set(0, -l, 0, "YXZ"), n.identity(), n.makeRotationFromEuler(i), e.multiply(n), e.multiply(o), e
				}
		}();
	this.updateManualMove = function() {
		var e, t, o, a, v, y, T, R, b = new THREE.Euler(0, 0, 0, "YXZ"),
			H = new THREE.Quaternion,
			w = new THREE.Quaternion,
			_ = 1;
		return function() {
			w.copy(u), g === E.MANUAL_ROTATE ? (e = (l - c) * r * this.manualDragDirection, t = (s - h) * i * this.manualDragDirection, o = THREE.Math.degToRad(e), a = THREE.Math.degToRad(t), H.set(0, Math.sin(a / 2), 0, Math.cos(a / 2)), w.multiply(H), H.set(Math.sin(o / 2), 0, 0, Math.cos(o / 2)), w.multiply(H), v = b.setFromQuaternion(u, "YXZ").z, y = b.setFromQuaternion(w, "YXZ").z, T = b.setFromQuaternion(x || u, "YXZ").z, H.set(0, 0, Math.sin((T - v) / 2), Math.cos((T - v) / 2)), u.multiply(H), H.set(0, 0, Math.sin((T - y) / 2), Math.cos((T - y) / 2)), w.multiply(H), this.object.quaternion.copy(w)) : g === E.MANUAL_ZOOM && (d = f.distanceTo(m), R = p / d, _ >= R && (this.object.fov = n * R, this.object.updateProjectionMatrix()), x && (v = b.setFromQuaternion(u, "YXZ").z, T = b.setFromQuaternion(x, "YXZ").z, H.set(0, 0, Math.sin((T - v) / 2), Math.cos((T - v) / 2)), u.multiply(H), this.object.quaternion.copy(u)))
		}
	}(), this.updateDeviceMove = function() {
		var e, t, i, r, n;
		return function() {
			if (e = THREE.Math.degToRad(this.deviceOrientation.alpha || 0), t = THREE.Math.degToRad(this.deviceOrientation.beta || 0), i = THREE.Math.degToRad(this.deviceOrientation.gamma || 0), r = THREE.Math.degToRad(this.screenOrientation || 0), 0 !== e && 0 !== t && 0 !== i) {
				if (this.useQuaternions ? x = b(e, t, i, r) : (n = H(e, t, i, r), x.setFromRotationMatrix(n)), this.freeze) return;
				this.object.quaternion.copy(x)
			}
		}
	}(), this.update = function() {
		this.deviceOrientationManual ? this.updateDeviceMove() : this.updateManualMove()
	}, this.connect = function() {
		window.addEventListener("resize", this.constrainObjectFOV, !1), window.addEventListener("orientationchange", this.onScreenOrientationChange, !1), window.addEventListener("deviceorientation", this.onDeviceOrientationChange, !1), window.addEventListener("compassneedscalibration", this.onCompassNeedsCalibration, !1), this.element.addEventListener("mousedown", this.onDocumentMouseDown, !1), this.element.addEventListener("touchstart", this.onDocumentTouchStart, !1), this.freeze = !1
	}, this.disconnect = function() {
		this.freeze = !0, window.removeEventListener("resize", this.constrainObjectFOV, !1), window.removeEventListener("orientationchange", this.onScreenOrientationChange, !1), window.removeEventListener("deviceorientation", this.onDeviceOrientationChange, !1), window.removeEventListener("compassneedscalibration", this.onCompassNeedsCalibration, !1), this.element.removeEventListener("mousedown", this.onDocumentMouseDown, !1), this.element.removeEventListener("touchstart", this.onDocumentTouchStart, !1)
	}
};
DeviceOrientationController.prototype = Object.create(THREE.EventDispatcher.prototype),
	function(e) {
		if ("function" == typeof define && define.amd) define(e);
		else if ("object" == typeof exports) module.exports = e();
		else {
			var t = window.Cookies,
				i = window.Cookies = e();
			i.noConflict = function() {
				return window.Cookies = t, i
			}
		}
	}(function() {
		function e() {
			for (var e = 0, t = {}; e < arguments.length; e++) {
				var i = arguments[e];
				for (var r in i) t[r] = i[r]
			}
			return t
		}

		function t(i) {
			function r(t, n, o) {
				var a;
				if (arguments.length > 1) {
					if (o = e({
							path: "/"
						}, r.defaults, o), "number" == typeof o.expires) {
						var s = new Date;
						s.setMilliseconds(s.getMilliseconds() + 864e5 * o.expires), o.expires = s
					}
					try {
						a = JSON.stringify(n), /^[\{\[]/.test(a) && (n = a)
					} catch (l) {}
					return n = i.write ? i.write(n, t) : encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = encodeURIComponent(String(t)), t = t.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent), t = t.replace(/[\(\)]/g, escape), document.cookie = [t, "=", n, o.expires && "; expires=" + o.expires.toUTCString(), o.path && "; path=" + o.path, o.domain && "; domain=" + o.domain, o.secure ? "; secure" : ""].join("")
				}
				t || (a = {});
				for (var h = document.cookie ? document.cookie.split("; ") : [], c = /(%[0-9A-Z]{2})+/g, u = 0; u < h.length; u++) {
					var p = h[u].split("="),
						d = p[0].replace(c, decodeURIComponent),
						f = p.slice(1).join("=");
					'"' === f.charAt(0) && (f = f.slice(1, -1));
					try {
						if (f = i.read ? i.read(f, d) : i(f, d) || f.replace(c, decodeURIComponent), this.json) try {
							f = JSON.parse(f)
						} catch (l) {}
						if (t === d) {
							a = f;
							break
						}
						t || (a[d] = f)
					} catch (l) {}
				}
				return a
			}
			return r.get = r.set = r, r.getJSON = function() {
				return r.apply({
					json: !0
				}, [].slice.call(arguments))
			}, r.defaults = {}, r.remove = function(t, i) {
				r(t, "", e(i, {
					expires: -1
				}))
			}, r.withConverter = t, r
		}
		return t(function() {})
	}), $(window).load(function() {
		function e() {
			progressTimeout = window.setTimeout(function() {
				"90" == $("#j-progress").text() && pageProgress.update(100), "100" == $("#j-progress").text() ? ($("#j-loading").hide(), $("#j-pane-container").find(">.page1>.fp-tableCell").removeClass("none"), $("#j-cube-page").show(), window.clearTimeout(progressTimeout)) : e()
			}, 200)
		}
		$("#j-pane-container>.page1>.fp-tableCell").addClass("none"), $("#j-pane-container").removeClass("hide"), e()
	}),
	function(e, t) {
		var i = e.documentElement,
			r = "orientationchange" in window ? "orientationchange" : "resize",
			n = function() {
				var e = i.clientWidth;
				e && (i.style.fontSize = 100 * (e / 375) + "px")
			};
		e.addEventListener && (t.addEventListener(r, n, !1), e.addEventListener("DOMContentLoaded", n, !1))
	}(document, window);
var BROWSER = function() {
	this.wWidth = document.documentElement.clientWidth, this.hHeight = document.documentElement.clientHeight, this.setVideoScreen(".video_full_screen", "center center")
};
BROWSER.prototype = {
	setVideoScreen: function(e, t) {
		var i, r = this.wWidth,
			n = this.hHeight,
			o = r / n,
			a = 320 / 504;
		i = a > o ? n / 504 : r / 320, $(e).attr("style", "-webkit-transform:scale(" + i + ");transform:scale(" + i + ");-webkit-transform-origin:" + t + ";transform-origin:" + t + ";")
	},
	browser: {
		versions: function() {
			var e = navigator.userAgent;
			navigator.appVersion;
			return {
				trident: e.indexOf("Trident") > -1,
				presto: e.indexOf("Presto") > -1,
				webKit: e.indexOf("AppleWebKit") > -1,
				gecko: e.indexOf("Gecko") > -1 && -1 == e.indexOf("KHTML"),
				mobile: !!e.match(/AppleWebKit.*Mobile.*/),
				ios: !!e.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				android: e.indexOf("Android") > -1 || e.indexOf("Linux") > -1,
				iPhone: e.indexOf("iPhone") > -1,
				iPad: e.indexOf("iPad") > -1,
				webApp: -1 == e.indexOf("Safari"),
				weixin: e.indexOf("MicroMessenger") > -1,
				qq: " qq" == e.match(/\sQQ/i)
			}
		}(),
		language: (navigator.browserLanguage || navigator.language).toLowerCase()
	}
}