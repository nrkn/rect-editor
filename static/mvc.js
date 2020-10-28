(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppController = void 0;
const app_1 = require("../../views/app");
const document_1 = require("../../views/document");
const toolbar_1 = require("../../views/toolbar");
exports.createAppController = (options) => {
    const documentView = document_1.createDocumentView(options);
    const toolbarView = toolbar_1.createToolbarView(options);
    const appView = app_1.createAppView(options, documentView, toolbarView);
    appView.events.viewSize.on(documentView.setViewSize);
    appView.events.transform.on(documentView.setTransform);
    const run = () => {
        appView.render();
    };
    return { run };
};

},{"../../views/app":6,"../../views/document":7,"../../views/toolbar":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToolbar = exports.populateForm = void 0;
const h_1 = require("../../lib/dom/h");
const types_1 = require("../types");
exports.populateForm = (formEl) => {
    formEl.append(...exports.createToolbar());
};
exports.createToolbar = () => [
    ...createActionButtons(),
    createPointerModes(),
    createSizeEditor('Snap to Grid', 'cell')
];
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

},{"../../lib/dom/h":13,"../types":5}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRectAt = exports.getDrawRects = exports.svgRectToRect = exports.createRectEl = exports.setRectElRect = void 0;
const s_1 = require("../../lib/dom/s");
const rect_1 = require("../../lib/geometry/rect");
const util_1 = require("../../lib/util");
exports.setRectElRect = (rectEl, newRect = {}) => {
    const initialRect = exports.svgRectToRect(rectEl);
    const { x, y, width, height } = Object.assign({}, initialRect, newRect);
    rectEl.x.baseVal.value = x;
    rectEl.y.baseVal.value = y;
    rectEl.width.baseVal.value = width;
    rectEl.height.baseVal.value = height;
};
exports.createRectEl = (id = util_1.randomId(), { x = 0, y = 0, width = 1, height = 1 } = {}) => {
    const rectEl = s_1.rect({
        id,
        class: 'draw-rect',
        fill: 'rgba( 255, 255, 255, 0.75 )'
    });
    exports.setRectElRect(rectEl, { x, y, width, height });
    return rectEl;
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
exports.getDrawRects = (state) => {
    const { groupEl } = state.dom;
    const rects = groupEl.querySelectorAll('.draw-rect');
    return [...rects];
};
exports.findRectAt = (state, point) => {
    const rectEls = exports.getDrawRects(state);
    for (let i = rectEls.length - 1; i >= 0; i--) {
        const rectEl = rectEls[i];
        const rect = exports.svgRectToRect(rectEl);
        if (rect_1.rectContainsPoint(rect, point))
            return rectEl;
    }
};

},{"../../lib/dom/s":15,"../../lib/geometry/rect":20,"../../lib/util":21}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appModes = void 0;
exports.appModes = ['pan', 'draw', 'select'];

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppView = void 0;
const object_fit_math_1 = require("object-fit-math");
const util_1 = require("../../../lib/dom/util");
const events_1 = require("../../../lib/events");
exports.createAppView = (options, documentView, toolbarView) => {
    const viewportEl = util_1.strictSelect('#viewport');
    const toolsEl = util_1.strictSelect('#tools');
    const state = {
        viewSize: { width: 0, height: 0 }
    };
    const render = () => {
        viewportEl.append(documentView.render());
        toolsEl.append(toolbarView.render());
        initResize(viewportEl, events.viewSize);
        zoomToFit();
    };
    const zoomToFit = () => {
        const viewSize = getViewSize(viewportEl);
        const { x: fx, y: fy, width: fw } = object_fit_math_1.fitAndPosition(viewSize, options.gridSize, 'contain', '50%', '50%');
        const scale = fw / options.gridSize.width;
        const x = fx / scale;
        const y = fy / scale;
        events.transform.emit({ x, y, scale });
    };
    const events = {
        viewSize: events_1.createEmitter(),
        transform: events_1.createEmitter()
    };
    return { render, events };
};
const getViewSize = (viewportEl) => viewportEl.getBoundingClientRect();
const initResize = (viewportEl, emitter) => {
    const onResize = () => emitter.emit(viewportEl.getBoundingClientRect());
    window.addEventListener('resize', onResize);
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
};

},{"../../../lib/dom/util":16,"../../../lib/events":17,"object-fit-math":24}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentView = void 0;
const geometry_1 = require("../../../lib/dom/geometry");
const util_1 = require("../../../lib/dom/util");
const rects_1 = require("../../dom/rects");
const render_1 = require("./render");
exports.createDocumentView = (options) => {
    const { svgEl, groupEl } = render_1.renderSvgRoot(options);
    const render = () => svgEl;
    const create = (...elements) => elements.forEach(({ id, rect }) => groupEl.append(rects_1.createRectEl(id, rect)));
    const update = (...elements) => elements.forEach(({ id, rect }) => rects_1.setRectElRect(getRect(id), rect));
    const remove = (...ids) => ids.forEach(id => getRect(id).remove());
    const getRect = (id) => util_1.strictSelect(`#${id}`, groupEl);
    const setViewSize = ({ width, height }) => geometry_1.setViewBox(svgEl, { x: 0, y: 0, width, height });
    const setTransform = (transform) => {
        ensureMinScale(transform, options.minScale);
        util_1.attr(groupEl, { transform: geometry_1.transformToSvg(transform) });
    };
    const view = {
        render, create, update, remove, setViewSize, setTransform
    };
    return view;
};
const ensureMinScale = (transform, minScale) => {
    if (transform.scale < minScale)
        transform.scale = minScale;
};

},{"../../../lib/dom/geometry":12,"../../../lib/dom/util":16,"../../dom/rects":3,"./render":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSvgRoot = void 0;
const defs_1 = require("../../../lib/dom/defs");
const geometry_1 = require("../../../lib/dom/geometry");
const s_1 = require("../../../lib/dom/s");
const util_1 = require("../../../lib/dom/util");
const grid_bg_1 = require("../../image-generators/grid-bg");
exports.renderSvgRoot = (options) => {
    const { gridSize, cellSize } = options;
    const gridRect = Object.assign({ x: 0, y: 0 }, gridSize);
    const svgEl = s_1.svg();
    geometry_1.setViewBox(svgEl, gridRect);
    const groupEl = s_1.g();
    svgEl.append(groupEl);
    const defsManager = defs_1.createDefsManager(svgEl);
    const { width: cw, height: ch } = cellSize;
    const gridBg = grid_bg_1.createGridBg(cw, ch);
    defsManager.setPattern('gridBg', gridBg);
    const gridRectEl = s_1.rect();
    groupEl.append(gridRectEl);
    util_1.attr(gridRectEl, gridRect, {
        fill: 'url(#gridBg)',
    });
    return { svgEl, groupEl, gridRectEl, defsManager };
};

},{"../../../lib/dom/defs":11,"../../../lib/dom/geometry":12,"../../../lib/dom/s":15,"../../../lib/dom/util":16,"../../image-generators/grid-bg":4}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToolbarView = void 0;
const h_1 = require("../../../lib/dom/h");
const form_tools_1 = require("../../dom/form-tools");
exports.createToolbarView = (options) => {
    const render = () => h_1.form(...form_tools_1.createToolbar());
    return { render };
};

},{"../../../lib/dom/h":13,"../../dom/form-tools":2}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgNs = void 0;
exports.svgNs = 'http://www.w3.org/2000/svg';

},{}],11:[function(require,module,exports){
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

},{"./s":15,"./util":16}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setViewBox = exports.getViewBoxRect = exports.transformToSvg = void 0;
const util_1 = require("./util");
exports.transformToSvg = ({ x, y, scale }) => `translate(${x} ${y}) scale(${scale})`;
exports.getViewBoxRect = (svg) => svg.viewBox.baseVal;
exports.setViewBox = (svg, { x, y, width, height }) => {
    util_1.attr(svg, { viewBox: [x, y, width, height].join(' ') });
};

},{"./util":16}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.form = exports.button = exports.input = exports.label = exports.legend = exports.fieldset = exports.div = exports.htmlElementFactory = exports.text = exports.fragment = exports.h = void 0;
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
exports.form = exports.htmlElementFactory('form');

},{"./predicates":14,"./util":16}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSVGElement = exports.isElement = exports.isNode = void 0;
const consts_1 = require("./consts");
exports.isNode = (value) => value && typeof value['nodeType'] === 'number';
exports.isElement = (value) => value && value['nodeType'] === 1;
exports.isSVGElement = (value) => exports.isElement(value) && value.namespaceURI === consts_1.svgNs;

},{"./consts":10}],15:[function(require,module,exports){
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

},{"./consts":10,"./predicates":14,"./util":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictGetData = exports.strictFormElement = exports.strictSelect = exports.attr = void 0;
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
exports.strictGetData = (el, key) => {
    const value = el.dataset[key];
    if (value === undefined)
        throw Error(`Expected element dataset to contain ${key}`);
    return value;
};

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmitter = void 0;
exports.createEmitter = () => {
    const listeners = [];
    let onces = [];
    const on = (listener) => {
        listeners.push(listener);
        return {
            dispose: () => off(listener)
        };
    };
    const once = (listener) => {
        onces.push(listener);
    };
    const off = (listener) => {
        const callbackIndex = listeners.indexOf(listener);
        if (callbackIndex > -1)
            listeners.splice(callbackIndex, 1);
    };
    const emit = (event) => {
        listeners.forEach(listener => listener(event));
        if (onces.length > 0) {
            const existing = onces;
            onces = [];
            existing.forEach(listener => listener(event));
        }
    };
    return { on, once, off, emit };
};

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapToGrid = void 0;
exports.snapToGrid = (value, grid) => Math.floor(value / grid) * grid;

},{}],19:[function(require,module,exports){
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

},{"./number":18}],20:[function(require,module,exports){
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
exports.translateRect = (rect, { x, y }) => {
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
    if (point.x > (rect.x + rect.width))
        return false;
    if (point.y > (rect.y + rect.height))
        return false;
    return true;
};

},{"./point":19}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.createSequence = exports.randomInt = exports.randomChar = exports.randomId = void 0;
exports.randomId = () => exports.createSequence(16, exports.randomChar).join('');
exports.randomChar = () => String.fromCharCode(exports.randomInt(26) + 97);
exports.randomInt = (exclMax) => Math.floor(Math.random() * exclMax);
exports.createSequence = (length, cb) => Array.from({ length }, (_v, index) => cb(index));
exports.clone = (value) => JSON.parse(JSON.stringify(value));

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const app_1 = require("./app/controllers/app");
exports.createApp = (opts = {}) => {
    const options = Object.assign({}, defaultOptions, opts);
    const controller = app_1.createAppController(options);
    controller.run();
};
const defaultOptions = {
    gridSize: { width: 1000, height: 1000 },
    cellSize: { width: 16, height: 16 },
    minScale: 0.1,
    snap: { width: 1, height: 1 },
};
exports.createApp();

},{"./app/controllers/app":1}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./fitter":23,"./predicates":25,"./transform-fitted-point":26}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{"./fitter":23}]},{},[22]);
