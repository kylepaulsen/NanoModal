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
