function El(tag, classNames) {
    var doc = document;
    var el = doc.createElement(tag);
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
        el.appendChild(elObject.el);
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
