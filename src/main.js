var nanoModal = (function() {

    var fs = require("fs");

    var El = require("./El");
    var Modal = require("./Modal");
    var ModalStack = require("./ModalStack");

    var overlay;
    var overlayClose = true;
    var modalsContainer;
    var modalStack = ModalStack();
    var doc = document;
    var orientationChange = "orientationchange";

    (function init() {
        if (doc.querySelectorAll(".nanoModalOverlay").length === 0) {
            // Put the main styles on the page.
            var styleObj = El("style");
            var style = styleObj.el;
            var firstElInHead = doc.querySelectorAll("head")[0].childNodes[0];
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
            El(doc).addListener("keydown", function(e) {
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

    // private functions
    var setOverlayClose = function() {
        var options = modalStack.top().options;
        overlayClose = !!options.overlayClose;
    };

    var getDocumentDim = function(name) {
        var elem = doc;
        var docE = elem.documentElement;
        var scroll = "scroll" + name;
        var offset = "offset" + name;
        return Math.max(elem.body[scroll], docE[scroll],
            elem.body[offset], docE[offset], docE["client" + name]);
    };

    var resizeOverlay = function() {
        overlay.setStyle("width", getDocumentDim("Width") + "px");
        overlay.setStyle("height", getDocumentDim("Height") + "px");
    };

    if (orientationChange in document.documentElement) {
        // Make SURE we have the correct dimensions so we make the overlay the right size.
        // Some devices fire the event before the document is ready to return the new dimensions.
        window.addEventListener(orientationChange, function() {
            for (var t = 0; t < 3; ++t) {
                setTimeout(resizeOverlay, 1000 * t + 200);
            }
        });
    }

    return function(content, options) {
        options = options || {};
        var modalObj = Modal(content, options);

        if (modalObj) {
            modalObj.onShow(function() {
                overlay.show();
                modalStack.push(modalObj);
                setOverlayClose();
                resizeOverlay();
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
        window.define(function() {
            return nanoModal;
        });
    }
    window.nanoModal = nanoModal;
}
if (typeof module !== "undefined") {
    module.exports = nanoModal;
}
