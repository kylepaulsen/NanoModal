var nanoModal = (function() {

    var fs = require("fs");

    var El = require("./El");

    var overlay;
    var modals = [];

    // HELPERS ==========
    var get = function(qry) {
        return document.querySelectorAll(qry);
    };

    // PRIVATE FUNCTIONS ======
    function hideAllModals() {
        var x = modals.length;
        while (x-- > 0) {
            modals[x].hide();
        }
    }

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
                overlay.hide();
                hideAllModals();
            });
            overlay.addToBody(overlay);
        }
    })();

    return function(options) {
        var modal = El("div", "nanoModal nanoModalOverride");
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
            modal.appendChild(options.content);
        } else {
            modal.el.innerHTML = options.content;
        }

        var show = function() {
            hideAllModals();
            modal.show();
            modal.setStyle("marginLeft", -modal.el.clientWidth / 2 + "px");
            overlay.show();
        };

        var hide = function() {
            if (modal.isShowing()) {
                hideAllModals();
                overlay.hide();
            }
        };

        var destroy = function() {
            hide();
            modal.destroy();
        };

        modals.push(modal);
        modal.addToBody();

        return {
            show: show,
            hide: hide,
            destroy: destroy
        };
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
