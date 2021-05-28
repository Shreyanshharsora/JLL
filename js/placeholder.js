;
window.Modernizr = function(a, b, c) {
	function x() {
		e.input = function(a) {
			for (var b = 0, c = a.length; b < c; b++) o[a[b]] = a[b] in k;
			return o
		}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "))
	}
	function w(a, b) {
		return !!~ ("" + a).indexOf(b)
	}
	function v(a, b) {
		return typeof a === b
	}
	function u(a, b) {
		return t(prefixes.join(a + ";") + (b || ""))
	}
	function t(a) {
		j.cssText = a
	}
	var d = "2.0.6",
		e = {},
		f = b.documentElement,
		g = b.head || b.getElementsByTagName("head")[0],
		h = "modernizr",
		i = b.createElement(h),
		j = i.style,
		k = b.createElement("input"),
		l = Object.prototype.toString,
		m = {},
		n = {},
		o = {},
		p = [],
		q, r = {}.hasOwnProperty,
		s;
	!v(r, c) && !v(r.call, c) ? s = function(a, b) {
		return r.call(a, b)
	} : s = function(a, b) {
		return b in a && v(a.constructor.prototype[b], c)
	};
	for (var y in m) s(m, y) && (q = y.toLowerCase(), e[q] = m[y](), p.push((e[q] ? "" : "no-") + q));
	e.input || x(), t(""), i = k = null, e._version = d;
	return e
}(this, this.document);
$(document).ready(function() {
	if (typeof(Modernizr) != 'undefined' && !Modernizr.input.placeholder) {
		$('input[type="text"], input[type="email"], input[type="password"], textarea').each(function() {
			if ($(this).attr('type') == 'password') {
				$(this).attr('type', 'text').addClass('passwordField');
			}
			var phAttr = $(this).attr('placeholder');
			if (typeof(phAttr) != 'undefined' && phAttr != false) {
				if (phAttr != null && phAttr != '') {
					$(this).addClass('default_title_text');
					$(this).val(phAttr);
					$(this).focus(function() {
						if ($(this).hasClass('passwordField')) {
							$(this).attr('type', 'password');
						}
						$(this).removeClass('default_title_text');
						if ($(this).val() == $(this).attr('placeholder')) {
							$(this).val('');
						}
					});
					$(this).blur(function() {
						if ($(this).attr('type') == 'password' && $(this).val() == '') {
							$(this).attr('type', 'text').addClass('passwordField');
						}
						if ($(this).val() == '') {
							$(this).val($(this).attr('placeholder'));
							$(this).addClass('default_title_text');
						}
					});
				}
			}
		});
	}
});