(function () {
    'use strict';
    const originalAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (this === window && type === 'mousedown') {
            return;
        }
        return originalAdd.call(this, type, listener, options);
    };
    delete window.onmousedown;

    Object.defineProperty(window, 'onmousedown', {
        get: function () {
            return null;
        },
        set: function (value) {
            return;
        },
        configurable: true,
        enumerable: true
    });
    function fuckAds() {
        const el = document.querySelectorAll(':where(video:not([width]):not([height]), iframe:not([width]):not([height]))')
        el.forEach(element => {
            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('pointerEvents', 'none', 'important');
            element.style.setProperty('height', '0', 'important');
            element.style.setProperty('width', '0', 'important');
        });
    }
    setInterval(() => {
        fuckAds();
    }, 50);
})();
