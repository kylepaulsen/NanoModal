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

    var top = function() {
        return stack[stack.length - 1];
    };

    var push = function(modalObj) {
        remove(modalObj);
        if (stack.length > 0) {
            var el = top().modal.el;
            if (el) {
                el.style.zIndex = 9997;
            }
        }
        stack.push(modalObj);
        modalObj.modal.el.style.zIndex = 9999;
    };

    var pop = function() {
        var obj = stack.pop();
        if (stack.length > 0) {
            var el = top().modal.el;
            if (el) {
                el.style.zIndex = 9999;
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
