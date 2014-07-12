function ModalStack() {
    var stack = [];

    var get = function(id) {
        return document.getElementById(id);
    };

    var top = function() {
        return stack[stack.length - 1];
    };

    var push = function(modal) {
        if (stack.length > 0) {
            var el = get(top().modal.el.id);
            if (el) {
                el.style.zIndex = 9997;
            }
        }
        stack.push(modal);
    };

    var pop = function() {
        var obj = stack.pop();
        if (stack.length > 0) {
            var el = get(top().modal.el.id);
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
