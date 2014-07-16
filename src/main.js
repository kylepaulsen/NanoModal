var ModalEvent = require("./ModalEvent");

var nanoModal = (function() {

    var fs = require("fs");

    var El = require("./El");
    var Modal = require("./Modal");

    var overlay;
    var doc = document;
    var orientationChange = "orientationchange";

    (function init() {
        if (!doc.querySelector("#nanoModalOverlay")) {
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
            overlay.el.id = "nanoModalOverlay";
            doc.body.appendChild(overlay.el);

            // Add an event so that the modals can hook into it to close.
            overlay.onRequestHide = ModalEvent();

            var overlayCloseFunc = function() {
                overlay.onRequestHide.fire();
            };

            overlay.addClickListener(overlayCloseFunc);
            El(doc).addListener("keydown", function(e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode === 27) { // 27 is Escape
                    overlayCloseFunc();
                }
            });
        }
    })();

    if (orientationChange in doc.documentElement) {
        // Make SURE we have the correct dimensions so we make the overlay the right size.
        // Some devices fire the event before the document is ready to return the new dimensions.
        window.addEventListener(orientationChange, function() {
            for (var t = 0; t < 3; ++t) {
                setTimeout(Modal.resizeOverlay, 1000 * t + 200);
            }
        });
    }

    var api = function(content, options) {
        return Modal(content, options, overlay, api.customShow, api.customHide);
    };
    api.resizeOverlay = Modal.resizeOverlay;

    return api;
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
