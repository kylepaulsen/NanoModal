
var El = require("./El");
var ModalEvent = require("./ModalEvent");

function Modal(options) {
    var modal = El("div", "nanoModal nanoModalOverride");
    var content = El("div", "nanoModalContent");
    var buttonArea = El("div", "nanoModalButtons");
    modal.add(content);
    modal.add(buttonArea);

    var onShowEvent = ModalEvent();
    var onHideEvent = ModalEvent();

    if (typeof options === "undefined") {
        return;
    }
    if (options.content === undefined) {
        var text = options;
        options = {
            content: text
        };
    }
    if (options.content instanceof Node) {
        content.el.appendChild(options.content);
    } else {
        content.el.innerHTML = options.content;
    }

    if (options.buttons === undefined) {
        options.buttons = [{text: "Close", handler: "hide", primary: true}];
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

    (function addButtons() {
        var btnIdx = options.buttons.length;
        var btnObj;
        var btnEl;
        var classes;

        if (btnIdx === 0) {
            buttonArea.remove();
        } else {
            while (btnIdx-- > 0) {
                btnObj = options.buttons[btnIdx];
                classes = "nanoModalBtn";
                if (btnObj.primary) {
                    classes += " nanoModalBtnPrimary";
                }
                btnEl = El("button", classes);
                if (btnObj.handler === "hide") {
                    btnEl.addClickListener(hide);
                } else if (btnObj.handler) {
                    btnEl.addClickListener(btnObj.handler);
                }
                btnEl.el.innerText = btnObj.text;
                buttonArea.add(btnEl);
            }
        }
    })();

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
