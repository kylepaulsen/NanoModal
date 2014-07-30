function touchClick(el) {
    var eventType = "ontouchend" in document.documentElement ? "touchstart" : "click";
    var clickEvent = document.createEvent('MouseEvent');
    clickEvent.initMouseEvent(eventType, true, true, window,
        0, 0, 0, 0, 0, false, false, false, false, 0, null);

    el.dispatchEvent(clickEvent);
}
