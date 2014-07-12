
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
        modal.el.appendChild(options.content);
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
