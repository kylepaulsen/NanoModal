(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function El(tag, classNames) {
    var doc = document;
    var el = tag.nodeType || tag === window ? tag : doc.createElement(tag);
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
        var t = eventHandlers.length;
        var handlerObj;
        while (t-- > 0) {
            handlerObj = eventHandlers[t];
            if (handlerObj.event === event && handlerObj.handler === handler) {
                eventHandlers.splice(t, 1);
                break;
            }
        }
    }

    function addClickListener(handler) {
        if ('ontouchstart' in document.documentElement) {
            addListener("touchstart", handler);
        } else {
            addListener("click", handler);
        }
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

    function html(html) {
        if (el) {
            el.innerHTML = html;
        }
    }

    function text(text) {
        if (el) {
            html("");
            el.appendChild(doc.createTextNode(text));
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

    function add(elObject) {
        var elementToAppend = elObject.el || elObject;
        el.appendChild(elementToAppend);
    }

    function addToBody() {
        doc.body.appendChild(el);
    }

    return {
        el: el,
        addListener: addListener,
        addClickListener: addClickListener,
        show: show,
        hide: hide,
        isShowing: isShowing,
        setStyle: setStyle,
        html: html,
        text: text,
        remove: remove,
        add: add,
        addToBody: addToBody
    };
}

module.exports = El;

},{}],2:[function(require,module,exports){

var El = require("./El");
var ModalEvent = require("./ModalEvent");

function Modal(content, options) {
    if (content === undefined) {
        return;
    }
    options = options || {};
    var modal = El("div", "nanoModal nanoModalOverride");
    var contentContainer = El("div", "nanoModalContent");
    var buttonArea = El("div", "nanoModalButtons");
    modal.add(contentContainer);
    modal.add(buttonArea);

    var buttons = [];
    var modalsContainer = El(document.getElementById("nanoModalsContainer"));

    var onShowEvent = ModalEvent();
    var onHideEvent = ModalEvent();

    options.buttons = options.buttons || [{
        text: "Close",
        handler: "hide",
        primary: true
    }];

    var removeButtons = function() {
        var t = buttons.length;
        while (t-- > 0) {
            var button = buttons[t];
            button.remove();
        }
        buttons = [];
    };

    var center = function() {
        modal.setStyle("marginLeft", -modal.el.clientWidth / 2 + "px");
    };

    var pub = {
        modal: modal,
        content: content,
        options: options,
        show: function() {
            modalsContainer.add(modal);
            modal.show();
            center();
            onShowEvent.fire(pub);
            return pub;
        },
        hide: function() {
            if (modal.isShowing()) {
                modal.hide();
                onHideEvent.fire(pub);
            }
            return pub;
        },
        onShow: function(callback) {
            onShowEvent.addListener(callback);
            return pub;
        },
        onHide: function(callback) {
            onHideEvent.addListener(callback);
            return pub;
        },
        remove: function() {
            pub.hide();
            removeButtons();
            modal.remove();
            onShowEvent.removeAllListeners();
            onHideEvent.removeAllListeners();
        },
        setButtons: function(buttonList) {
            var btnIdx = buttonList.length;
            var btnObj;
            var btnEl;
            var classes;

            removeButtons();

            if (btnIdx === 0) {
                buttonArea.hide();
            } else {
                buttonArea.show();
                while (btnIdx-- > 0) {
                    btnObj = buttonList[btnIdx];
                    classes = "nanoModalBtn";
                    if (btnObj.primary) {
                        classes += " nanoModalBtnPrimary";
                    }
                    btnEl = El("button", classes);
                    if (btnObj.handler === "hide") {
                        btnEl.addClickListener(pub.hide);
                    } else if (btnObj.handler) {
                        btnEl.addClickListener(btnObj.handler);
                    }
                    btnEl.text(btnObj.text);
                    buttonArea.add(btnEl);
                    buttons.push(btnEl);
                }
            }
            center();
            return pub;
        },
        setContent: function(newContent) {
            // Only good way of checking if a node in IE8...
            if (newContent.nodeType) {
                contentContainer.html("");
                contentContainer.add(newContent);
            } else {
                contentContainer.html(newContent);
            }
            center();
            return pub;
        }
    };

    pub.setContent(content).setButtons(options.buttons);
    modalsContainer.add(modal);

    return pub;
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
function ModalStack() {
    var stack = [];

    // private
    var remove = function(modalObj) {
        var t = stack.length;
        while (t-- > 0) {
            if (stack[t] === modalObj) {
                stack.splice(t, 1);
                break;
            }
        }
    };

    var getZIndex = function() {
        var overlay = document.querySelector(".nanoModalOverlay");
        var currentStyle = overlay.currentStyle;
        var zIndex = 9998;
        if (getComputedStyle) {
            var computed = getComputedStyle(overlay).zIndex;
            if (!isNaN(parseInt(computed, 10))) {
                zIndex = computed;
            }
        } else {
            if (currentStyle && !isNaN(parseInt(currentStyle.zIndex, 10))) {
                zIndex = currentStyle.zIndex;
            }
        }
        return parseInt(zIndex, 10);
    };

    // public
    var top = function() {
        return stack[stack.length - 1];
    };

    var push = function(modalObj) {
        var zIndex = getZIndex();
        remove(modalObj);
        if (stack.length > 0) {
            var el = top().modal.el;
            if (el) {
                el.style.zIndex = zIndex - 1;
            }
        }
        stack.push(modalObj);
        modalObj.modal.el.style.zIndex = zIndex + 1;
    };

    var pop = function() {
        var obj = stack.pop();
        if (stack.length > 0) {
            var el = top().modal.el;
            if (el) {
                el.style.zIndex = getZIndex() + 1;
            }
        }
        return obj;
    };

    return {
        stack: stack,
        push: push,
        pop: pop,
        top: top
    };
}

module.exports = ModalStack;

},{}],5:[function(require,module,exports){
var nanoModal = (function() {

    

    var El = require("./El");
    var Modal = require("./Modal");
    var ModalStack = require("./ModalStack");

    var overlay;
    var overlayClose = true;
    var modalsContainer;

    var modalId = 0;
    var modalStack = ModalStack();

    var setOverlayClose = function() {
        var options = modalStack.top().options;
        if (options.overlayClose === false) {
            overlayClose = false;
        } else {
            overlayClose = true;
        }
    };

    (function init() {
        if (document.querySelectorAll(".nanoModalOverlay").length === 0) {
            // Put the main styles on the page.
            var styleObj = El("style");
            var style = styleObj.el;
            var firstElInHead = document.querySelectorAll("head")[0].childNodes[0];
            firstElInHead.parentNode.insertBefore(style, firstElInHead);

            var styleText = ".nanoModal{position:absolute;top:100px;left:50%;display:none;z-index:9999;min-width:300px;padding:15px 20px 10px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;background:#fff;background:-moz-linear-gradient(top,#fff 0,#ddd 100%);background:-webkit-gradient(linear,left top,left bottom,color-stop(0%,#fff),color-stop(100%,#ddd));background:-webkit-linear-gradient(top,#fff 0,#ddd 100%);background:-o-linear-gradient(top,#fff 0,#ddd 100%);background:-ms-linear-gradient(top,#fff 0,#ddd 100%);background:linear-gradient(to bottom,#fff 0,#ddd 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffff', endColorstr='#dddddd', GradientType=0)}.nanoModalOverlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;background:#000;display:none;-ms-filter:\"alpha(Opacity=50)\";-moz-opacity:.5;-khtml-opacity:.5;opacity:.5}.nanoModalButtons{border-top:1px solid #ddd;margin-top:15px;text-align:right}.nanoModalBtn{color:#333;background-color:#fff;display:inline-block;padding:6px 12px;margin:8px 4px 0;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid transparent;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.nanoModalBtn:active,.nanoModalBtn:focus,.nanoModalBtn:hover{color:#333;background-color:#e6e6e6;border-color:#adadad}.nanoModalBtn.nanoModalBtnPrimary{color:#fff;background-color:#428bca;border-color:#357ebd}.nanoModalBtn.nanoModalBtnPrimary:active,.nanoModalBtn.nanoModalBtnPrimary:focus,.nanoModalBtn.nanoModalBtnPrimary:hover{color:#fff;background-color:#3071a9;border-color:#285e8e}";
            if (style.styleSheet) {
                style.styleSheet.cssText = styleText;
            } else {
                styleObj.text(styleText);
            }

            // Make the overlay and put it on the page.
            overlay = El("div", "nanoModalOverlay nanoModalOverride");
            var overlayCloseFunc = function() {
                if (overlayClose) {
                    if (modalStack.stack.length === 1) {
                        overlay.hide();
                    }
                    modalStack.top().hide();
                }
            };
            overlay.addClickListener(overlayCloseFunc);
            El(window).addListener("keydown", function(e) {
                if (modalStack.stack.length) {
                    var keyCode = (window.event) ? e.which : e.keyCode;
                    if (keyCode === 27) { // 27 is Escape
                        overlayCloseFunc();
                    }
                }
            });
            overlay.addToBody(overlay);

            modalsContainer = El("div");
            modalsContainer.el.id = "nanoModalsContainer";
            modalsContainer.addToBody();
        }
    })();

    return function(content, options) {
        options = options || {};
        var modalObj = Modal(content, options);

        if (modalObj) {
            modalObj.onShow(function() {
                overlay.show();
                modalStack.push(modalObj);
                setOverlayClose();
            }).onHide(function() {
                modalStack.pop();
                if (options.autoRemove) {
                    modalObj.remove();
                }
                if (modalStack.stack.length === 0) {
                    overlay.hide();
                } else {
                    setOverlayClose();
                }
            });

            return modalObj;
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

},{"./El":1,"./Modal":2,"./ModalStack":4}]},{},[1,2,3,4,5]);