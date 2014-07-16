var ModalEvent = require("./ModalEvent");

function El(tag, classNames) {
    var doc = document;
    var el = tag.nodeType ? tag : doc.createElement(tag);
    var eventHandlers = [];
    if (classNames) {
        el.className = classNames;
    }

    var onShowEvent = ModalEvent();
    var onHideEvent = ModalEvent();

    var addListener = function(event, handler) {
        if (el.addEventListener) {
            el.addEventListener(event, handler, false);
        } else {
            el.attachEvent("on" + event, handler);
        }
        eventHandlers.push({
            event: event,
            handler: handler
        });
    };

    var removeListener = function(event, handler) {
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
    };

    var addClickListener = function(handler) {
        if ("ontouchend" in document.documentElement) {
            addListener("touchstart", handler);
        } else {
            addListener("click", handler);
        }
    };

    var show = function() {
        if (el) {
            el.style.display = "block";
            onShowEvent.fire();
        }
    };

    var hide = function() {
        if (el) {
            el.style.display = "none";
            onHideEvent.fire();
        }
    };

    var isShowing = function() {
        return el.style && el.style.display === "block";
    };

    var setStyle = function(style, value) {
        if (el) {
            el.style[style] = value;
        }
    };

    var html = function(html) {
        if (el) {
            el.innerHTML = html;
        }
    };

    var text = function(text) {
        if (el) {
            html("");
            el.appendChild(doc.createTextNode(text));
        }
    };

    var remove = function() {
        if (el.parentNode) {
            var x = eventHandlers.length;
            var eventHandler;
            while (x-- > 0) {
                eventHandler = eventHandlers[x];
                removeListener(eventHandler.event, eventHandler.handler);
            }
            el.parentNode.removeChild(el);
            onShowEvent.removeAllListeners();
            onHideEvent.removeAllListeners();
        }
    };

    var add = function(elObject) {
        var elementToAppend = elObject.el || elObject;
        el.appendChild(elementToAppend);
    };

    return {
        el: el,
        addListener: addListener,
        addClickListener: addClickListener,
        onShowEvent: onShowEvent,
        onHideEvent: onHideEvent,
        show: show,
        hide: hide,
        isShowing: isShowing,
        setStyle: setStyle,
        html: html,
        text: text,
        remove: remove,
        add: add
    };
}

module.exports = El;
