function ModalStack() {
    var stack = [];

    // private
    var remove = function(modalObj) {
        var t = stack.length;
        while (t-- > 0) {
            if (stack[t] === modalObj) {
                stack.splice(t, 1);
                break;
            }
        }
    };

    var getZIndex = function() {
        var overlay = document.querySelector(".nanoModalOverlay");
        var currentStyle = overlay.currentStyle;
        var zIndex = 9998;
        if (getComputedStyle) {
            var computed = getComputedStyle(overlay).zIndex;
            if (!isNaN(parseInt(computed, 10))) {
                zIndex = computed;
            }
        } else {
            if (currentStyle && !isNaN(parseInt(currentStyle.zIndex, 10))) {
                zIndex = currentStyle.zIndex;
            }
        }
        return parseInt(zIndex, 10);
    };

    // public
    var top = function() {
        return stack[stack.length - 1];
    };

    var push = function(modalObj) {
        var zIndex = getZIndex();
        remove(modalObj);
        if (stack.length > 0) {
            var el = top().modal.el;
            if (el) {
                el.style.zIndex = zIndex - 1;
            }
        }
        stack.push(modalObj);
        modalObj.modal.el.style.zIndex = zIndex + 1;
    };

    var pop = function() {
        var obj = stack.pop();
        if (stack.length > 0) {
            var el = top().modal.el;
            if (el) {
                el.style.zIndex = getZIndex() + 1;
            }
        }
        return obj;
    };

    return {
        stack: stack,
        push: push,
        pop: pop,
        top: top
    };
}

module.exports = ModalStack;
