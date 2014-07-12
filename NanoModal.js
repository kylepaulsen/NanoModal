(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function El(tag, classNames) {
    var el = document.createElement(tag);
    var eventHandlers = [];
    if (classNames) {
        el.className = classNames;
    }

    function addListener(event, handler) {
        if (el.addEventListener) {
            el.addEventListener(event, handler, false);
        } else {
            el.attachEvent("on" + event, handler);
        }
        eventHandlers.push({
            event: event,
            handler: handler
        });
    }

    function removeListener(event, handler) {
        if (el.removeEventListener) {
            el.removeEventListener(event, handler);
        } else {
            el.detachEvent("on" + event, handler);
        }
    }

    function addClickListener(handler) {
        addListener("click", handler);
        addListener("touchstart", handler);
    }

    function show() {
        if (el) {
            el.style.display = "block";
        }
    }

    function hide() {
        if (el) {
            el.style.display = "none";
        }
    }

    function isShowing() {
        return el && el.style.display === "block";
    }

    function setStyle(style, value) {
        if (el) {
            el.style[style] = value;
        }
    }

    function remove() {
        var x = eventHandlers.length;
        var eventHandler;
        while (x-- > 0) {
            eventHandler = eventHandlers[x];
            removeListener(eventHandler.event, eventHandler.handler);
        }
        el.parentNode.removeChild(el);
    }

    function addToBody() {
        document.body.appendChild(el);
    }

    return {
        el: el,
        addListener: addListener,
        addClickListener: addClickListener,
        show: show,
        hide: hide,
        isShowing: isShowing,
        setStyle: setStyle,
        remove: remove,
        addToBody: addToBody
    };
}

module.exports = El;

},{}],2:[function(require,module,exports){

var El = require("./El");
var ModalEvent = require("./ModalEvent");

function Modal(options) {
    var modal = El("div", "nanoModal nanoModalOverride");
    var onShowEvent = ModalEvent();
    var onHideEvent = ModalEvent();

    if (typeof options === "undefined") {
        return;
    }
    if (typeof options.content === "undefined") {
        var text = options;
        options = {
            content: text
        };
    }
    if (options.content instanceof Node) {
        modal.appendChild(options.content);
    } else {
        modal.el.innerHTML = options.content;
    }

    var show = function() {
        modal.show();
        modal.setStyle("marginLeft", -modal.el.clientWidth / 2 + "px");
        onShowEvent.fire();
    };

    var hide = function() {
        if (modal.isShowing()) {
            modal.hide();
            onHideEvent.fire();
        }
    };

    var onShow = function(callback) {
        onShowEvent.addListener(callback);
    };

    var onHide = function(callback) {
        onHideEvent.addListener(callback);
    };

    var remove = function() {
        hide();
        modal.remove();
        onShowEvent.removeAllListeners();
        onHideEvent.removeAllListeners();
    };

    modal.addToBody();

    return {
        modal: modal,
        show: show,
        hide: hide,
        onShow: onShow,
        onHide: onHide,
        remove: remove
    };
}

module.exports = Modal;

},{"./El":1,"./ModalEvent":3}],3:[function(require,module,exports){
function ModalEvent() {
    var listeners = [];

    var addListener = function(callback) {
        listeners.push(callback);
        return listeners.length - 1;
    };

    var removeListener = function(id) {
        listeners.splice(id, 1);
    };

    var removeAllListeners = function() {
        listeners = [];
    };

    var fire = function() {
        for (var x = 0, num = listeners.length; x < num; ++x) {
            listeners[x].apply(null, arguments);
        }
    };

    return {
        addListener: addListener,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,
        fire: fire
    };
}

module.exports = ModalEvent;

},{}],4:[function(require,module,exports){
var nanoModal = (function() {

    

    var El = require("./El");
    var Modal = require("./Modal");

    var overlay;
    var overlayClose = true;

    // HELPERS ==========
    var get = function(qry) {
        return document.querySelectorAll(qry);
    };

    (function init() {
        if (get(".nanoModalOverlay").length === 0) {
            // Put the main styles on the page.
            var style = El("style");
            style.el.innerText = ".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:10px 20px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fff', endColorstr='#ddd', GradientType=0)}.nanoModalOverlay{position:fixed;top:0;left:0;width:100%;height:100%;opacity:.5;z-index:9998;background:#000;display:none}";
            var firstElInHead = get("head")[0].childNodes[0];
            firstElInHead.parentNode.insertBefore(style.el, firstElInHead);

            // Make the overlay and put it on the page.
            overlay = El("div", "nanoModalOverlay nanoModalOverride");
            overlay.addClickListener(function() {
                if (overlayClose) {
                    overlay.hide();
                    var modals = get(".nanoModal");
                    var t = modals.length;
                    while (t-- > 0) {
                        modals[t].style.display = "none";
                    }
                }
            });
            overlay.addToBody(overlay);
        }
    })();

    return function(options) {
        var modal = Modal(options);

        if (modal) {
            modal.onShow(function() {
                overlay.show();
                if (options.overlayClose === false) {
                    overlayClose = false;
                } else {
                    overlayClose = true;
                }
            });

            modal.onHide(function() {
                overlay.hide();
            });

            return modal;
        }
    };
})();

if (typeof window !== "undefined") {
    if (typeof window.define === "function" && window.define.amd) {
        window.define(function () {
            return nanoModal;
        });
    }
    window.nanoModal = nanoModal;
}
if (typeof module !== "undefined") {
    module.exports = nanoModal;
}

},{"./El":1,"./Modal":2}]},{},[1,2,3,4]);