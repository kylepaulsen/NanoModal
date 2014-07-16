var nanoModal = (function() {

    var fs = require("fs");

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

            var styleText = fs.readFileSync("src/style.min.css", "utf8");
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
            El(document).addListener("keydown", function(e) {
                if (modalStack.stack.length) {
                    var keyCode = e.which || e.keyCode;
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
                if (modalObj !== modalStack.top()) {
                    modalStack.remove(modalObj);
                } else {
                    modalStack.pop();
                }
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
