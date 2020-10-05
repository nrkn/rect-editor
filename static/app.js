(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redoAction = exports.undoAction = exports.newAction = exports.createRectEl = exports.setRectElRect = exports.zoomAt = exports.switchMode = exports.getSelection = exports.selectRect = exports.selectNone = void 0;
const s_1 = require("../lib/dom/s");
const util_1 = require("../lib/dom/util");
const transform_1 = require("../lib/geometry/transform");
const util_2 = require("../lib/util");
const geometry_1 = require("./geometry");
const rects_1 = require("./rects");
exports.selectNone = (state) => {
    const rectEls = rects_1.getDrawRects(state);
    rectEls.forEach(rectEl => rectEl.classList.remove('selected'));
};
exports.selectRect = (_state, rectEl) => {
    rectEl.classList.add('selected');
};
exports.getSelection = (state) => {
    const rectEls = rects_1.getDrawRects(state);
    return rectEls.filter(el => el.classList.contains('selected'));
};
const changeEvent = new Event('change');
exports.switchMode = (state, mode) => {
    const { formEl } = state.dom;
    const modeEl = util_1.strictFormElement(formEl, 'mode');
    modeEl.value = mode;
    formEl.dispatchEvent(changeEvent);
};
exports.zoomAt = (state, { scale, x, y }) => {
    const { options } = state;
    const { minScale } = options;
    if (scale < minScale)
        scale = minScale;
    const newTransform = transform_1.transformRelativeTo(state.transform, scale, { x, y });
    Object.assign(state.transform, newTransform);
    geometry_1.applyTransform(state);
};
exports.setRectElRect = (rectEl, { x = 0, y = 0, width = 1, height = 1 } = {}) => {
    rectEl.x.baseVal.value = x;
    rectEl.y.baseVal.value = y;
    rectEl.width.baseVal.value = width;
    rectEl.height.baseVal.value = height;
};
exports.createRectEl = (id = util_2.randomId(), { x = 0, y = 0, width = 1, height = 1 } = {}) => {
    const rectEl = s_1.rect({
        id,
        class: 'draw-rect',
        fill: 'rgba( 255, 255, 255, 0.75 )'
    });
    exports.setRectElRect(rectEl, { x, y, width, height });
    return rectEl;
};
exports.newAction = (state, action) => {
    // do the thing
    const { actions } = state;
    const { nextIndex } = actions;
    actions.list = [...actions.list.slice(0, nextIndex), action];
    actions.nextIndex = actions.list.length;
};
exports.undoAction = (state) => {
    const { actions } = state;
    const { list } = actions;
    if (list.length === 0)
        return;
    const action = list[actions.nextIndex - 1];
    undoActions[action.type](state, action);
    actions.nextIndex--;
};
exports.redoAction = (state) => {
    const { actions } = state;
    const { list, nextIndex } = actions;
    if (list.length === 0 || nextIndex === list.length)
        return;
    const action = list[actions.nextIndex];
    redoActions[action.type](state, action);
    actions.nextIndex++;
};
// this is all fucked up - figure out how to type this correctly!
const undoActions = {
    add: (state, { id }) => {
        const rectEl = util_1.strictSelect(`#${id}`, state.dom.groupEl);
        rectEl.remove();
    },
    delete: (state, { id, rect }) => {
        const rectEl = exports.createRectEl(id, rect);
        /*
          TODO - how to put it back in the right place in the dom list? Keep track
          of previous/next siblings?
        */
        state.dom.groupEl.append(rectEl);
    },
    edit: (state, action) => {
        const { id, previous } = action;
        const rectEl = util_1.strictSelect(`#${id}`, state.dom.groupEl);
        exports.setRectElRect(rectEl, previous);
    }
};
const redoActions = {
    add: (state, { id, rect }) => {
        const rectEl = exports.createRectEl(id, rect);
        /*
          TODO - how to put it back in the right place in the dom list? Keep track
          of previous/next siblings? also - this is same as undo delete - reuse
          that code
        */
        state.dom.groupEl.append(rectEl);
    },
    delete: (state, { id }) => {
        // nb same as undo add, reuse that code
        const rectEl = util_1.strictSelect(`#${id}`, state.dom.groupEl);
        rectEl.remove();
    },
    edit: (state, { id, rect }) => {
        const rectEl = util_1.strictSelect(`#${id}`, state.dom.groupEl);
        exports.setRectElRect(rectEl, rect);
    }
};

},{"../lib/dom/s":20,"../lib/dom/util":21,"../lib/geometry/transform":26,"../lib/util":27,"./geometry":4,"./rects":10}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateForm = void 0;
const h_1 = require("../../lib/dom/h");
const types_1 = require("../types");
exports.populateForm = (formEl) => {
    formEl.append(...createActionButtons(), createPointerModes(), createSizeEditor('Snap to Grid', 'cell'));
};
const createActionButtons = () => {
    return [
        h_1.button({ type: 'button', id: 'undo' }, 'Undo'),
        h_1.button({ type: 'button', id: 'redo' }, 'Redo'),
        h_1.button({ type: 'button', id: 'resetZoom' }, 'Reset Zoom')
    ];
};
const createPointerModes = () => h_1.fieldset(h_1.legend('Pointer Mode'), ...types_1.appModes.map(createPointerMode));
const createPointerMode = (mode) => h_1.div(h_1.label(h_1.input({ name: 'mode', type: 'radio', value: mode, checked: '' }), ` ${mode}`));
const createSizeEditor = (title, prefix) => h_1.fieldset(h_1.legend(title), createIntegerEditor('Width', `${prefix}Width`), createIntegerEditor('Height', `${prefix}Height`));
const createIntegerEditor = (title, name, step = 1, value = 1, min = 1) => h_1.div(h_1.label(title, h_1.input({ name, type: 'number', value, min, step })));

},{"../../lib/dom/h":18,"../types":12}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgRectToRect = exports.applyTransform = exports.ensureMinScale = exports.getLocalCenter = exports.zoomToFit = exports.localToGrid = void 0;
const object_fit_math_1 = require("object-fit-math");
const util_1 = require("../lib/dom/util");
const geometry_1 = require("../lib/dom/geometry");
exports.localToGrid = (x, y, transform, viewBoxOffset) => {
    const { x: tx, y: ty, scale } = transform;
    const { x: vx, y: vy } = viewBoxOffset;
    x += vx;
    y += vy;
    x -= tx;
    y -= ty;
    x /= scale;
    y /= scale;
    return { x, y };
};
exports.zoomToFit = (state) => {
    const { viewportEl } = state.dom;
    const { gridSize } = state.options;
    const parentSize = viewportEl.getBoundingClientRect();
    const { x: fx, y: fy, width: fw } = object_fit_math_1.fitAndPosition(parentSize, gridSize, 'contain', '50%', '50%');
    const scale = fw / gridSize.width;
    const x = fx / scale;
    const y = fy / scale;
    Object.assign(state.transform, { x, y, scale });
    exports.applyTransform(state);
};
exports.getLocalCenter = (state) => {
    const { viewportEl } = state.dom;
    const { width, height } = viewportEl.getBoundingClientRect();
    const x = width / 2;
    const y = height / 2;
    return { x, y };
};
exports.ensureMinScale = (state) => {
    const { transform, options } = state;
    const { minScale } = options;
    if (transform.scale < minScale)
        transform.scale = minScale;
};
exports.applyTransform = (state) => {
    const { transform } = state;
    const { groupEl } = state.dom;
    exports.ensureMinScale(state);
    util_1.attr(groupEl, { transform: geometry_1.transformToSvg(transform) });
};
exports.svgRectToRect = (el) => {
    const { x: ex, y: ey, width: ew, height: eh } = el;
    const x = ex.baseVal.value;
    const y = ey.baseVal.value;
    const width = ew.baseVal.value;
    const height = eh.baseVal.value;
    const rect = { x, y, width, height };
    return rect;
};

},{"../lib/dom/geometry":17,"../lib/dom/util":21,"object-fit-math":29}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const s_1 = require("../lib/dom/s");
const util_1 = require("../lib/dom/util");
const geometry_1 = require("../lib/dom/geometry");
const geometry_2 = require("./geometry");
const raster_1 = require("./raster");
const defs_1 = require("../lib/dom/defs");
const io_1 = require("./io");
const tools_1 = require("./tools");
const form_tools_1 = require("./dom/form-tools");
exports.createApp = (opts = {}) => {
    const options = Object.assign({}, defaultOptions, opts);
    const state = initState(options);
    initResize(state);
    tools_1.initForm(state);
    io_1.initIOEvents(state);
    geometry_2.zoomToFit(state);
};
const defaultOptions = {
    gridSize: { width: 1000, height: 1000 },
    cellSize: { width: 16, height: 16 },
    minScale: 0.1,
    snap: { width: 1, height: 1 },
};
const initState = (options) => {
    const transform = { x: 0, y: 0, scale: 1 };
    const { viewportEl, formEl } = getDomElements();
    /*
      needs to happen before anything else or the layout is weird - maybe we
      are measuring something in createSVGElements? or when we trigger resize
      event manually?
    */
    form_tools_1.populateForm(formEl);
    const { svgEl, groupEl, defsManager } = createSvgElements(options);
    viewportEl.append(svgEl);
    const mode = 'pan';
    const dom = { viewportEl, formEl, svgEl, groupEl };
    const dragLine = null;
    const creatingRectEl = null;
    const keys = {};
    const actions = {
        list: [],
        nextIndex: 0
    };
    const state = {
        mode, transform, dom, options, defsManager, dragLine, creatingRectEl, keys,
        actions
    };
    return state;
};
const getDomElements = () => {
    const mainEl = util_1.strictSelect('main');
    const viewportEl = util_1.strictSelect('#viewport', mainEl);
    const formEl = util_1.strictSelect('form', mainEl);
    return { viewportEl, formEl };
};
const createSvgElements = (options) => {
    const { gridSize, cellSize } = options;
    const gridRect = Object.assign({ x: 0, y: 0 }, gridSize);
    const svgEl = s_1.svg();
    geometry_1.setViewBox(svgEl, gridRect);
    const groupEl = s_1.g();
    svgEl.append(groupEl);
    const defsManager = defs_1.createDefsManager(svgEl);
    const { width: cw, height: ch } = cellSize;
    const gridBg = raster_1.createGridBg(cw, ch);
    defsManager.setPattern('gridBg', gridBg);
    const gridRectEl = s_1.rect();
    groupEl.append(gridRectEl);
    util_1.attr(gridRectEl, gridRect, {
        fill: 'url(#gridBg)',
    });
    return { svgEl, groupEl, gridRectEl, defsManager };
};
const initResize = (state) => {
    const { viewportEl, svgEl } = state.dom;
    const onResize = () => {
        const { width, height } = viewportEl.getBoundingClientRect();
        const rect = Object.assign({ x: 0, y: 0, width, height });
        geometry_1.setViewBox(svgEl, rect);
    };
    window.addEventListener('resize', onResize);
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
};

},{"../lib/dom/defs":16,"../lib/dom/geometry":17,"../lib/dom/s":20,"../lib/dom/util":21,"./dom/form-tools":3,"./geometry":4,"./io":6,"./raster":9,"./tools":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIOEvents = void 0;
const create_events_1 = require("../../lib/create-events");
const s_1 = require("../../lib/dom/s");
const util_1 = require("../../lib/dom/util");
const geometry_1 = require("../../lib/dom/geometry");
const line_1 = require("../../lib/geometry/line");
const rects_1 = require("../rects");
const actions_1 = require("../actions");
const geometry_2 = require("../geometry");
const key_1 = require("./key");
const util_2 = require("../../lib/util");
exports.initIOEvents = (state) => {
    const { dom, options } = state;
    const { viewportEl, groupEl } = dom;
    const event = create_events_1.createInputEvents({ target: viewportEl, preventDefault: true });
    viewportEl.addEventListener('wheel', e => {
        e.preventDefault();
        const { left, top } = viewportEl.getBoundingClientRect();
        const { deltaY, clientX, clientY } = e;
        const { scale } = state.transform;
        const x = clientX - left;
        const y = clientY - top;
        const newScale = scale + deltaY * -0.1;
        actions_1.zoomAt(state, { x, y, scale: newScale });
    });
    window.addEventListener('keydown', e => {
        state.keys[e.key] = true;
        key_1.keyHandler(state, e.key);
    });
    window.addEventListener('keyup', e => {
        state.keys[e.key] = false;
    });
    event.on('down', ({ position }) => {
        console.log('down', { position });
    });
    event.on('up', ({ position }) => {
        console.log('up', { position });
        if (state.creatingRectEl) {
            const { width, height } = state.creatingRectEl;
            if (width.baseVal.value === 0 || height.baseVal.value === 0) {
                state.creatingRectEl.remove();
                state.creatingRectEl = null;
                return;
            }
            actions_1.selectNone(state);
            actions_1.selectRect(state, state.creatingRectEl);
            actions_1.newAction(state, {
                type: 'add',
                id: state.creatingRectEl.id,
                rect: geometry_2.svgRectToRect(state.creatingRectEl)
            });
            state.creatingRectEl = null;
        }
        state.dragLine = null;
    });
    event.on('move', ({ position, dragging }) => {
        if (!dragging)
            return;
        const { x, y } = normalizeLocal(state, position);
        if (state.dragLine) {
            state.dragLine.x2 = x;
            state.dragLine.y2 = y;
        }
        else {
            state.dragLine = { x1: x, y1: y, x2: x, y2: y };
        }
        if (state.mode === 'pan') {
            const { x: dX, y: dY } = line_1.lineToVector(state.dragLine);
            state.transform.x += dX;
            state.transform.y += dY;
            geometry_2.applyTransform(state);
            return;
        }
        if (state.mode === 'draw') {
            if (!state.creatingRectEl) {
                state.creatingRectEl = s_1.rect({
                    id: util_2.randomId(),
                    class: 'draw-rect',
                    fill: 'rgba( 255, 255, 255, 0.75 )'
                });
                groupEl.append(state.creatingRectEl);
            }
            const { x1, x2, y1, y2 } = state.dragLine;
            if (x1 >= x2 || y1 >= y2)
                return;
            const line = line_1.snapLineToGrid(state.dragLine, options.snap);
            const { x1: x, y1: y } = line;
            const { x: width, y: height } = line_1.lineToVector(line);
            util_1.attr(state.creatingRectEl, { x, y, width, height });
        }
    });
    event.on('tap', ({ position }) => {
        actions_1.selectNone(state);
        const localPosition = normalizeLocal(state, position);
        const selectedRectEl = rects_1.findRectAt(state, localPosition);
        if (state.mode === 'draw' && selectedRectEl !== undefined) {
            actions_1.switchMode(state, 'select');
        }
        if (state.mode === 'select') {
            const selectedRectEl = rects_1.findRectAt(state, localPosition);
            if (selectedRectEl !== undefined) {
                actions_1.selectRect(state, selectedRectEl);
            }
            return;
        }
    });
};
const normalizeLocal = (state, [x, y]) => {
    const viewBoxRect = geometry_1.getViewBoxRect(state.dom.svgEl);
    return geometry_2.localToGrid(x, y, state.transform, viewBoxRect);
};

},{"../../lib/create-events":14,"../../lib/dom/geometry":17,"../../lib/dom/s":20,"../../lib/dom/util":21,"../../lib/geometry/line":22,"../../lib/util":27,"../actions":2,"../geometry":4,"../rects":10,"./key":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyHandler = void 0;
const actions_1 = require("../actions");
const geometry_1 = require("../geometry");
exports.keyHandler = (state, key) => {
    const { options } = state;
    if (isResetZoom(key)) {
        geometry_1.zoomToFit(state);
        return;
    }
    if (isZoom(key)) {
        const { x, y } = geometry_1.getLocalCenter(state);
        let scale = state.transform.scale;
        if (key === '-') {
            scale = state.transform.scale - 0.25;
        }
        if (key === '+') {
            scale = state.transform.scale + 0.25;
        }
        actions_1.zoomAt(state, { x, y, scale });
        return;
    }
    if (isMove(key)) {
        const { cellSize } = options;
        let { width, height } = cellSize;
        let { x, y, scale } = state.transform;
        width *= scale;
        height *= scale;
        if (key === 'ArrowLeft') {
            x += width;
        }
        if (key === 'ArrowRight') {
            x -= width;
        }
        if (key === 'ArrowUp') {
            y += height;
        }
        if (key === 'ArrowDown') {
            y -= height;
        }
        Object.assign(state.transform, { x, y });
        geometry_1.applyTransform(state);
        return;
    }
    if (isDelete(key)) {
        // ...
        return;
    }
    if (isUndoRedo(key) && state.keys.Control) {
        console.log('Undo or Redo');
        if (state.keys.Shift) {
            console.log('Redo');
            actions_1.redoAction(state);
        }
        else {
            console.log('Undo');
            actions_1.undoAction(state);
        }
    }
};
const isResetZoom = (key) => key === '*';
const isDelete = (key) => key === 'Delete';
const isZoom = (key) => ['-', '+'].includes(key);
const isMove = (key) => ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
const isUndoRedo = (key) => key.toLowerCase() === 'z';

},{"../actions":2,"../geometry":4}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppMode = void 0;
const types_1 = require("./types");
exports.isAppMode = (value) => types_1.appModes.includes(value);

},{"./types":12}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGridBg = void 0;
const R = 0;
const G = 1;
const B = 2;
const A = 3;
exports.createGridBg = (width, height) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    const imageData = new ImageData(width, height);
    const highlight = [64, 64, 64, 255];
    const body = [32, 32, 32, 255];
    const shadow = [0, 0, 0, 255];
    const lastX = width - 1;
    const lastY = height - 1;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = index + R;
            const g = index + G;
            const b = index + B;
            const a = index + A;
            const isCorner = ((x === 0 && y === lastY) ||
                (x === lastX && y === 0));
            const isHighLight = (!isCorner &&
                (x === 0 || y === 0));
            const isShadow = (!isCorner &&
                !isHighLight &&
                (x === lastX || y === lastY));
            const color = (isHighLight ? highlight :
                isShadow ? shadow :
                    body);
            imageData.data[r] = color[R];
            imageData.data[g] = color[G];
            imageData.data[b] = color[B];
            imageData.data[a] = color[A];
        }
    }
    context.putImageData(imageData, 0, 0);
    return canvas;
};

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRectAt = exports.getDrawRects = void 0;
const rect_1 = require("../lib/geometry/rect");
const geometry_1 = require("./geometry");
exports.getDrawRects = (state) => {
    const { groupEl } = state.dom;
    const rects = groupEl.querySelectorAll('.draw-rect');
    return [...rects];
};
exports.findRectAt = (state, point) => {
    const rectEls = exports.getDrawRects(state);
    for (let i = rectEls.length - 1; i >= 0; i--) {
        const rectEl = rectEls[i];
        const rect = geometry_1.svgRectToRect(rectEl);
        if (rect_1.rectContainsPoint(rect, point))
            return rectEl;
    }
};

},{"../lib/geometry/rect":25,"./geometry":4}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initForm = void 0;
const util_1 = require("../lib/dom/util");
const geometry_1 = require("./geometry");
const predicates_1 = require("./predicates");
exports.initForm = (state) => {
    const { options } = state;
    const { formEl } = state.dom;
    const modeEl = util_1.strictFormElement(formEl, 'mode');
    const cellWidthEl = util_1.strictFormElement(formEl, 'cellWidth');
    const cellHeightEl = util_1.strictFormElement(formEl, 'cellHeight');
    formEl.addEventListener('change', () => {
        const newMode = modeEl.value;
        if (predicates_1.isAppMode(newMode)) {
            state.mode = newMode;
        }
        else {
            throw Error(`Unexpected mode ${newMode}`);
        }
        const cellWidth = parseInt(cellWidthEl.value);
        const cellHeight = parseInt(cellHeightEl.value);
        if (!isNaN(cellWidth) && cellWidth >= 1) {
            options.snap.width = cellWidth;
        }
        if (!isNaN(cellHeight) && cellHeight >= 1) {
            options.snap.height = cellHeight;
        }
    });
    const resetZoomButtonEl = util_1.strictSelect('#resetZoom', formEl);
    resetZoomButtonEl.addEventListener('click', () => geometry_1.zoomToFit(state));
    modeEl.value = 'pan';
    cellWidthEl.value = String(options.snap.width);
    cellHeightEl.value = String(options.snap.height);
};

},{"../lib/dom/util":21,"./geometry":4,"./predicates":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionTypes = exports.appModes = void 0;
exports.appModes = ['pan', 'draw', 'select'];
exports.actionTypes = ['add', 'delete', 'edit'];

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.createApp();

},{"./app":5}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInputEvents = void 0;
const events_1 = require("events");
exports.createInputEvents = (opt) => {
    if (opt == null)
        opt = window;
    if (isDOMNode(opt))
        opt = { target: opt };
    const { target = window, parent = window, tapDistanceThreshold = 10, tapDelay = 300, preventDefault = false, filtered = true, passive = true } = opt;
    const eventOpts = passive ? { passive: true } : undefined;
    const emitter = new events_1.EventEmitter();
    let initialIdentifier;
    let dragging = false;
    let lastTime;
    let lastPosition;
    let attached = false;
    attach();
    emitter['enable'] = attach;
    emitter['disable'] = detach;
    Object.defineProperties(emitter, {
        target: {
            get() { return target; }
        },
        parent: {
            get() { return parent; }
        }
    });
    return emitter;
    function mousedown(event) {
        // mark the drag event as having started
        dragging = true;
        const touch = getCurrentEvent(event);
        const result = createEvent(event, touch, target);
        lastPosition = result.position.slice();
        lastTime = Date.now();
        emitter.emit('down', result);
    }
    function mouseup(event) {
        const wasDragging = dragging;
        const touch = getCurrentEvent(event);
        let valid = true;
        if (filtered && event.changedTouches &&
            (!touch || touch.identifier !== initialIdentifier)) {
            // skip entirely if this touch doesn't match expected
            valid = false;
        }
        if (touch && valid) {
            const result = createEvent(event, touch, target);
            initialIdentifier = null;
            if (wasDragging || result.inside) {
                // If the interaction was or is inside, emit an event
                emitter.emit('up', result);
            }
            if (lastPosition != null) {
                const nowTime = Date.now();
                const delta = nowTime - lastTime;
                const dist = distance(result.position, lastPosition);
                if (delta <= tapDelay && dist < tapDistanceThreshold) {
                    emitter.emit('tap', result);
                }
                lastPosition = null;
            }
            dragging = false;
        }
    }
    function mousemove(event) {
        const touch = getCurrentEvent(event);
        if (touch) {
            // we didn't have an identifier and now we do
            if (filtered && event.changedTouches && touch.identifier != null) {
                const bounds = getElementBounds(target);
                if (isInsideBounds(touch, bounds)) {
                    // ensure dragging is set to true
                    dragging = true;
                }
            }
            const result = createEvent(event, touch, target);
            if (dragging || result.inside) {
                emitter.emit('move', result);
            }
        }
    }
    function attach() {
        if (attached)
            return;
        attached = true;
        target.addEventListener('touchstart', mousedown, eventOpts);
        parent.addEventListener('touchend', mouseup, eventOpts);
        parent.addEventListener('touchmove', mousemove, eventOpts);
        target.addEventListener('mousedown', mousedown, eventOpts);
        parent.addEventListener('mouseup', mouseup, eventOpts);
        parent.addEventListener('mousemove', mousemove, eventOpts);
        if (preventDefault) {
            window.addEventListener('dragstart', preventDefaultEvent, {
                passive: false
            });
            document.addEventListener('touchmove', preventDefaultEvent, {
                passive: false
            });
        }
    }
    function detach() {
        if (!attached)
            return;
        attached = false;
        target.removeEventListener('touchstart', mousedown);
        parent.removeEventListener('touchend', mouseup);
        parent.removeEventListener('touchmove', mousemove);
        target.removeEventListener('mousedown', mousedown);
        parent.removeEventListener('mouseup', mouseup);
        parent.removeEventListener('mousemove', mousemove);
        if (preventDefault) {
            window.removeEventListener('dragstart', preventDefaultEvent);
            document.removeEventListener('touchmove', preventDefaultEvent);
        }
    }
    function preventDefaultEvent(ev) {
        ev.preventDefault();
        return false;
    }
    function getCurrentEvent(event) {
        if (event.changedTouches) {
            const list = event.changedTouches;
            if (filtered) {
                if (initialIdentifier == null) {
                    // first time tracking, mark identifier
                    const first = getFirstTargetTouch(list) || list[0];
                    initialIdentifier = first.identifier;
                    return first;
                }
                else {
                    // identifier exists, try to get it
                    return getTouch(list, initialIdentifier);
                }
            }
            else {
                return list[0];
            }
        }
        else {
            return event;
        }
    }
    function getFirstTargetTouch(touches) {
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            if (t.target === target)
                return t;
        }
        return null;
    }
    function getTouch(touches, id) {
        for (let i = 0; i < touches.length; i++) {
            const t = touches[i];
            if (t.identifier === id) {
                return t;
            }
        }
        return null;
    }
    function createEvent(event, touch, target) {
        const bounds = getElementBounds(target);
        const position = getPosition(touch, target, bounds);
        const uv = getNormalizedPosition(position, bounds);
        return {
            dragging,
            touch,
            inside: isInsideBounds(touch, bounds),
            position,
            uv,
            event,
            bounds
        };
    }
};
function distance(a, b) {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return Math.sqrt(x * x + y * y);
}
function isInsideBounds(event, bounds) {
    const { clientX, clientY } = event;
    return (clientX >= bounds.left &&
        clientX < bounds.right &&
        clientY >= bounds.top &&
        clientY < bounds.bottom);
}
function getNormalizedPosition(position, bounds) {
    return [
        position[0] / bounds.width,
        position[1] / bounds.height
    ];
}
function getPosition(event, _target, bounds) {
    const { clientX, clientY } = event;
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    return [x, y];
}
function getElementBounds(element) {
    if (element === window ||
        element === document ||
        element === document.body) {
        return {
            x: 0,
            y: 0,
            left: 0,
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
    else {
        return element.getBoundingClientRect();
    }
}
function isDOMNode(obj) {
    if (!obj || obj == null)
        return false;
    const winEl = typeof window !== 'undefined' ? window : null;
    return (obj === winEl ||
        (typeof obj.nodeType === 'number' && typeof obj.nodeName === 'string'));
}

},{"events":1}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgNs = void 0;
exports.svgNs = 'http://www.w3.org/2000/svg';

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefsManager = void 0;
const s_1 = require("./s");
const util_1 = require("./util");
const patternUnits = 'userSpaceOnUse';
exports.createDefsManager = (svgEl) => {
    const defsEl = s_1.defs();
    svgEl.append(defsEl);
    const names = new Set();
    const setPattern = (id, canvas) => {
        if (names.has(id)) {
            const pattern = util_1.strictSelect(`#${id}`, defsEl);
            pattern.remove();
        }
        const { width, height } = canvas;
        const dataUrl = canvas.toDataURL();
        const imageEl = s_1.image({ href: `${dataUrl}`, x: 0, y: 0, width, height });
        imageEl.style.imageRendering = 'crisp-edges';
        const patternEl = s_1.pattern({ id, patternUnits, width, height }, imageEl);
        defsEl.append(patternEl);
        names.add(id);
    };
    const getNames = () => [...names];
    const manager = { getNames, setPattern };
    return manager;
};

},{"./s":20,"./util":21}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setViewBox = exports.getViewBoxRect = exports.transformToSvg = void 0;
const util_1 = require("./util");
exports.transformToSvg = ({ x, y, scale }) => `translate(${x} ${y}) scale(${scale})`;
exports.getViewBoxRect = (svg) => svg.viewBox.baseVal;
exports.setViewBox = (svg, { x, y, width, height }) => {
    util_1.attr(svg, { viewBox: [x, y, width, height].join(' ') });
};

},{"./util":21}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.button = exports.input = exports.label = exports.legend = exports.fieldset = exports.div = exports.htmlElementFactory = exports.text = exports.fragment = exports.h = void 0;
const predicates_1 = require("./predicates");
const util_1 = require("./util");
exports.h = (name, ...args) => {
    const el = document.createElement(name);
    args.forEach(arg => {
        if (predicates_1.isNode(arg) || typeof arg === 'string') {
            el.append(arg);
        }
        else {
            util_1.attr(el, arg);
        }
    });
    return el;
};
exports.fragment = (...args) => {
    const documentFragment = document.createDocumentFragment();
    documentFragment.append(...args);
    return documentFragment;
};
exports.text = (value = '') => {
    const textNode = document.createTextNode(value);
    return textNode;
};
exports.htmlElementFactory = (name) => (...args) => exports.h(name, ...args);
exports.div = exports.htmlElementFactory('div');
exports.fieldset = exports.htmlElementFactory('fieldset');
exports.legend = exports.htmlElementFactory('legend');
exports.label = exports.htmlElementFactory('label');
exports.input = exports.htmlElementFactory('input');
exports.button = exports.htmlElementFactory('button');

},{"./predicates":19,"./util":21}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSVGElement = exports.isElement = exports.isNode = void 0;
const consts_1 = require("./consts");
exports.isNode = (value) => value && typeof value['nodeType'] === 'number';
exports.isElement = (value) => value && value['nodeType'] === 1;
exports.isSVGElement = (value) => exports.isElement(value) && value.namespaceURI === consts_1.svgNs;

},{"./consts":15}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pattern = exports.image = exports.defs = exports.circle = exports.rect = exports.g = exports.svg = exports.svgElementFactory = exports.s = void 0;
const consts_1 = require("./consts");
const predicates_1 = require("./predicates");
const util_1 = require("./util");
exports.s = (name, ...args) => {
    const el = document.createElementNS(consts_1.svgNs, name);
    args.forEach(arg => {
        if (predicates_1.isSVGElement(arg)) {
            el.appendChild(arg);
        }
        else {
            util_1.attr(el, arg);
        }
    });
    return el;
};
exports.svgElementFactory = (name) => (...args) => exports.s(name, ...args);
exports.svg = exports.svgElementFactory('svg');
exports.g = exports.svgElementFactory('g');
exports.rect = exports.svgElementFactory('rect');
exports.circle = exports.svgElementFactory('circle');
exports.defs = exports.svgElementFactory('defs');
exports.image = exports.svgElementFactory('image');
exports.pattern = exports.svgElementFactory('pattern');

},{"./consts":15,"./predicates":19,"./util":21}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictFormElement = exports.strictSelect = exports.attr = void 0;
exports.attr = (el, ...attributeRecords) => {
    attributeRecords.forEach(attributes => {
        Object.keys(attributes).forEach(key => {
            const value = String(attributes[key]);
            el.setAttribute(key, value);
        });
    });
};
exports.strictSelect = (selectors, el = document) => {
    const result = el.querySelector(selectors);
    if (result === null)
        throw Error(`Expected ${selectors} to match something`);
    return result;
};
exports.strictFormElement = (formEl, name) => {
    const el = formEl.elements.namedItem(name);
    if (el instanceof HTMLInputElement)
        return el;
    if (el instanceof RadioNodeList)
        return el;
    throw Error(`Expected an HTMLInputElement or RadioNodeList called ${name}`);
};

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapLineToGrid = exports.lineToArgs = exports.argsToLine = exports.normalizeLine = exports.lineToVector = void 0;
const number_1 = require("./number");
exports.lineToVector = ({ x1, y1, x2, y2 }) => ({
    x: x2 - x1,
    y: y2 - y1
});
exports.normalizeLine = ({ x1: startX, y1: startY, x2: endX, y2: endY }) => {
    const x1 = Math.min(startX, endX);
    const x2 = Math.max(startX, endX);
    const y1 = Math.min(startY, endY);
    const y2 = Math.max(startY, endY);
    return { x1, y1, x2, y2 };
};
exports.argsToLine = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });
exports.lineToArgs = ({ x1, y1, x2, y2 }) => [x1, y1, x2, y2];
exports.snapLineToGrid = ({ x1, y1, x2, y2 }, { width: gridW, height: gridH }) => {
    x1 = number_1.snapToGrid(x1, gridW);
    y1 = number_1.snapToGrid(y1, gridH);
    x2 = number_1.snapToGrid(x2, gridW);
    y2 = number_1.snapToGrid(y2, gridH);
    return { x1, y1, x2, y2 };
};

},{"./number":23}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapToGrid = void 0;
exports.snapToGrid = (value, grid) => Math.floor(value / grid) * grid;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapPointToGrid = exports.scalePoint = exports.translatePoint = void 0;
const number_1 = require("./number");
exports.translatePoint = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
    x: x1 + x2,
    y: y1 + y2
});
exports.scalePoint = ({ x, y }, scale) => ({
    x: x * scale,
    y: y * scale
});
exports.snapPointToGrid = ({ x, y }, { width: gridW, height: gridH }) => {
    x = number_1.snapToGrid(x, gridW);
    y = number_1.snapToGrid(y, gridH);
    return { x, y };
};

},{"./number":23}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rectContainsPoint = exports.scaleRect = exports.translateRect = exports.integerRect = void 0;
const point_1 = require("./point");
exports.integerRect = ({ x, y, width, height }) => {
    x = Math.floor(x);
    y = Math.floor(y);
    width = Math.floor(width);
    height = Math.floor(height);
    return { x, y, width, height };
};
exports.translateRect = (rect, x, y) => {
    const translatedPoint = point_1.translatePoint(rect, { x, y });
    return Object.assign({}, rect, translatedPoint);
};
exports.scaleRect = ({ x, y, width, height }, scale) => {
    x *= scale;
    y *= scale;
    width *= scale;
    height *= scale;
    return { x, y, width, height };
};
exports.rectContainsPoint = (rect, point) => {
    if (point.x < rect.x)
        return false;
    if (point.y < rect.y)
        return false;
    if (point.x > rect.x + rect.width)
        return false;
    if (point.y > rect.y + rect.height)
        return false;
    return true;
};

},{"./point":24}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformRelativeTo = void 0;
const point_1 = require("./point");
exports.transformRelativeTo = (existing, newScale, origin) => {
    const { scale } = existing;
    let newPoint = point_1.translatePoint(existing, point_1.scalePoint(origin, -1));
    newPoint = point_1.scalePoint(newPoint, newScale / scale);
    newPoint = point_1.translatePoint(newPoint, origin);
    const transformed = Object.assign(newPoint, { scale: newScale });
    return transformed;
};

},{"./point":24}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequence = exports.randomInt = exports.randomChar = exports.randomId = void 0;
exports.randomId = () => exports.createSequence(16, exports.randomChar).join('');
exports.randomChar = () => String.fromCharCode(exports.randomInt(26) + 97);
exports.randomInt = (exclMax) => Math.floor(Math.random() * exclMax);
exports.createSequence = (length, cb) => Array.from({ length }, (_v, index) => cb(index));

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fit = (parent, child, fitMode = 'fill') => {
    if (fitMode === 'scale-down') {
        if (child.width <= parent.width && child.height <= parent.height) {
            fitMode = 'none';
        }
        else {
            fitMode = 'contain';
        }
    }
    if (fitMode === 'cover' || fitMode === 'contain') {
        const wr = parent.width / child.width;
        const hr = parent.height / child.height;
        const ratio = fitMode === 'cover' ? Math.max(wr, hr) : Math.min(wr, hr);
        const width = child.width * ratio;
        const height = child.height * ratio;
        const size = { width, height };
        return size;
    }
    if (fitMode === 'none')
        return child;
    // default case, fitMode === 'fill'
    return parent;
};
exports.position = (parent, child, left = '50%', top = '50%') => {
    const x = lengthToPixels(left, parent.width, child.width);
    const y = lengthToPixels(top, parent.height, child.height);
    const point = { x, y };
    return point;
};
exports.fitAndPosition = (parent, child, fitMode = 'fill', left = '50%', top = '50%') => {
    const fitted = exports.fit(parent, child, fitMode);
    const { x, y } = exports.position(parent, fitted, left, top);
    const { width, height } = fitted;
    const rect = { x, y, width, height };
    return rect;
};
const lengthToPixels = (length, parent, child) => length.endsWith('%') ?
    (parent - child) * (parseFloat(length) / 100) :
    parseFloat(length);

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fitter_1 = require("./fitter");
exports.fit = fitter_1.fit;
exports.position = fitter_1.position;
exports.fitAndPosition = fitter_1.fitAndPosition;
var transform_fitted_point_1 = require("./transform-fitted-point");
exports.transformFittedPoint = transform_fitted_point_1.transformFittedPoint;
var predicates_1 = require("./predicates");
exports.isFit = predicates_1.isFit;

},{"./fitter":28,"./predicates":30,"./transform-fitted-point":31}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fitModes = {
    contain: true,
    cover: true,
    fill: true,
    none: true,
    'scale-down': true
};
exports.isFit = (value) => value in fitModes;

},{}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fitter_1 = require("./fitter");
exports.transformFittedPoint = (fittedPoint, parent, child, fitMode = 'fill', left = '50%', top = '50%') => {
    const { x: positionedX, y: positionedY, width: fittedWidth, height: fittedHeight } = fitter_1.fitAndPosition(parent, child, fitMode, left, top);
    const wRatio = child.width / fittedWidth;
    const hRatio = child.height / fittedHeight;
    const x = (fittedPoint.x - positionedX) * wRatio;
    const y = (fittedPoint.y - positionedY) * hRatio;
    const childPoint = { x, y };
    return childPoint;
};

},{"./fitter":28}]},{},[13]);
