
var El = require("./El");
var ModalEvent = require("./ModalEvent");

function Modal(options) {
    var modal = El("div", "nanoModal nanoModalOverride");
    var content = El("div", "nanoModalContent");
    var buttonArea = El("div", "nanoModalButtons");
    modal.add(content);
    modal.add(buttonArea);

    var modalsContainer = document.getElementById("nanoModalsContainer");

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

    var setContent = function(newContent) {
        if (newContent instanceof Node) {
            content.el.innerHTML = "";
            content.el.appendChild(newContent);
        } else {
            content.el.innerHTML = newContent;
        }
    };
    setContent(options.content);

    if (options.buttons === undefined) {
        options.buttons = [{text: "Close", handler: "hide", primary: true}];
    }

    var show = function() {
        modalsContainer.appendChild(modal.el);
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

    var setButtons = function(buttonList) {
        var btnIdx = buttonList.length;
        var btnObj;
        var btnEl;
        var classes;
        buttonArea.el.innerHTML = "";

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
                    btnEl.addClickListener(hide);
                } else if (btnObj.handler) {
                    btnEl.addClickListener(btnObj.handler);
                }
                btnEl.el.innerText = btnObj.text;
                buttonArea.add(btnEl);
            }
        }
    };
    setButtons(options.buttons);

    modalsContainer.appendChild(modal.el);

    return {
        modal: modal,
        options: options,
        show: show,
        hide: hide,
        onShow: onShow,
        onHide: onHide,
        remove: remove,
        setButtons: setButtons,
        setContent: setContent
    };
}

module.exports = Modal;
