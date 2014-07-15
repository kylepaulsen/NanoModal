
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
