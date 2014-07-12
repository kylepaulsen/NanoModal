function ModalEvent() {
    var listeners = [];

    var addListener = function(callback) {
        listeners.push(callback);
        return listeners.length - 1;
    };

    var removeListener = function(id) {
        listeners.splice(id, 1);
    };

    var removeAllListeners = function() {
        listeners = [];
    };

    var fire = function() {
        for (var x = 0, num = listeners.length; x < num; ++x) {
            listeners[x].apply(null, arguments);
        }
    };

    return {
        addListener: addListener,
        removeListener: removeListener,
        removeAllListeners: removeAllListeners,
        fire: fire
    };
}

module.exports = ModalEvent;
