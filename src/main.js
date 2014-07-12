var nanoModal = (function() {

    var fs = require("fs");

    var El = require("./El");
    var Modal = require("./Modal");

    var overlay;
    var overlayClose = true;

    // HELPERS ==========
    var get = function(qry) {
        return document.querySelectorAll(qry);
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
                    overlay.hide();
                    var modals = get(".nanoModal");
                    var t = modals.length;
                    while (t-- > 0) {
                        modals[t].style.display = "none";
                    }
                }
            });
            overlay.addToBody(overlay);
        }
    })();

    return function(options) {
        var modal = Modal(options);

        if (modal) {
            modal.onShow(function() {
                overlay.show();
                if (options.overlayClose === false) {
                    overlayClose = false;
                } else {
                    overlayClose = true;
                }
            });

            modal.onHide(function() {
                overlay.hide();
            });

            return modal;
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
