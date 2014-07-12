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

    // HELPERS ==========
    var get = function(qry) {
        return document.querySelectorAll(qry);
    };

    var setOverlayClose = function() {
        var options = modalStack.top().options;
        if (options.overlayClose === false) {
            overlayClose = false;
        } else {
            overlayClose = true;
        }
    };

    (function init() {
        if (get(".nanoModalOverlay").length === 0) {
            // Put the main styles on the page.
            var style = El("style");
            style.el.innerText = fs.readFileSync("src/style.min.css", "utf8");
            var firstElInHead = get("head")[0].childNodes[0];
            firstElInHead.parentNode.insertBefore(style.el, firstElInHead);

            // Make the overlay and put it on the page.
            overlay = El("div", "nanoModalOverlay nanoModalOverride");
            overlay.addClickListener(function() {
                if (overlayClose) {
                    if (modalStack.stack.length === 1) {
                        overlay.hide();
                    }
                    modalStack.top().hide();
                }
            });
            overlay.addToBody(overlay);

            modalsContainer = El("div");
            modalsContainer.el.id = "nanoModalsContainer";
            modalsContainer.addToBody();
        }
    })();

    return function(options) {
        var modalObj = Modal(options);

        if (modalObj) {
            modalObj.modal.el.id = "nanoModal-" + (modalId++);
            modalObj.onShow(function() {
                overlay.show();
                modalStack.push(modalObj);
                setOverlayClose();
            });

            modalObj.onHide(function() {
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
