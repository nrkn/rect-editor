(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppMode = exports.switchMode = void 0;
const util_1 = require("../../lib/dom/util");
const types_1 = require("../types");
const changeEvent = new Event('change');
exports.switchMode = (state, mode) => {
    const { formEl } = state.dom;
    const modeEl = util_1.strictFormElement(formEl, 'mode');
    modeEl.value = mode;
    formEl.dispatchEvent(changeEvent);
};
exports.isAppMode = (value) => types_1.appModes.includes(value);

},{"../../lib/dom/util":23,"../types":15}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelection = exports.isSelected = exports.toggleRect = exports.selectRect = exports.deselectRect = exports.selectAll = exports.selectNone = void 0;
const util_1 = require("../../lib/dom/util");
const rects_1 = require("../dom/rects");
const resizer_1 = require("../dom/resizer");
exports.selectNone = (state) => {
    const rectEls = rects_1.getDrawRects(state);
    rectEls.forEach(rectEl => rectEl.classList.remove('selected'));
    const resizeEls = state.dom.groupEl.querySelectorAll('.resizer');
    resizeEls.forEach(el => el.remove());
};
exports.selectAll = (state) => {
    exports.selectNone(state);
    const rectEls = rects_1.getDrawRects(state);
    rectEls.forEach(rectEl => exports.selectRect(state, rectEl));
};
exports.deselectRect = (state, rectEl) => {
    rectEl.classList.remove('selected');
    const { id } = rectEl;
    const resizerEl = util_1.strictSelect(`.resizer[data-id=${id}]`, state.dom.groupEl);
    resizerEl.remove();
};
exports.selectRect = (state, rectEl) => {
    rectEl.classList.add('selected');
    const rect = rects_1.svgRectToRect(rectEl);
    const resizeEl = resizer_1.createResizer(rect, rectEl.id);
    state.dom.groupEl.append(resizeEl);
};
exports.toggleRect = (state, rectEl) => {
    if (rectEl.classList.contains('selected')) {
        exports.deselectRect(state, rectEl);
    }
    else {
        exports.selectRect(state, rectEl);
    }
};
exports.isSelected = (rectEl) => rectEl.classList.contains('selected');
exports.getSelection = (state) => {
    const rectEls = rects_1.getDrawRects(state);
    return rectEls.filter(el => el.classList.contains('selected'));
};

},{"../../lib/dom/util":23,"../dom/rects":7,"../dom/resizer":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoomAt = exports.zoomToFit = void 0;
const object_fit_math_1 = require("object-fit-math");
const transform_1 = require("../../lib/geometry/transform");
const geometry_1 = require("../geometry");
exports.zoomToFit = (state) => {
    const { viewportEl } = state.dom;
    const { gridSize } = state.options;
    const parentSize = viewportEl.getBoundingClientRect();
    const { x: fx, y: fy, width: fw } = object_fit_math_1.fitAndPosition(parentSize, gridSize, 'contain', '50%', '50%');
    const scale = fw / gridSize.width;
    const x = fx / scale;
    const y = fy / scale;
    Object.assign(state.transform, { x, y, scale });
    geometry_1.applyTransform(state);
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

},{"../../lib/geometry/transform":32,"../geometry":9,"object-fit-math":36}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redoCommand = exports.undoCommand = exports.newCommand = void 0;
const util_1 = require("../../lib/dom/util");
const select_1 = require("../actions/select");
const rects_1 = require("../dom/rects");
exports.newCommand = (state, command) => {
    const { commands } = state;
    const { nextIndex } = commands;
    commands.list = [...commands.list.slice(0, nextIndex), command];
    commands.nextIndex = commands.list.length;
};
exports.undoCommand = (state) => {
    const { commands } = state;
    const { list } = commands;
    if (list.length === 0)
        return;
    const command = list[commands.nextIndex - 1];
    // wtf how to do this?
    undoCommands[command.type](state, command);
    commands.nextIndex--;
    select_1.selectNone(state);
};
exports.redoCommand = (state) => {
    const { commands } = state;
    const { list, nextIndex } = commands;
    if (list.length === 0 || nextIndex === list.length)
        return;
    const command = list[commands.nextIndex];
    // wtf how to do this?
    redoCommands[command.type](state, command);
    commands.nextIndex++;
    select_1.selectNone(state);
};
const add = (state, { id, rect }) => {
    const rectEl = rects_1.createRectEl(id, rect);
    /*
      TODO - how to put it back in the right place in the dom list? Keep track
      of previous/next siblings?
    */
    state.dom.groupEl.append(rectEl);
};
const del = (state, { id }) => {
    const rectEl = util_1.strictSelect(`#${id}`, state.dom.groupEl);
    rectEl.remove();
};
const edit = (state, id, rect) => {
    const rectEl = util_1.strictSelect(`#${id}`, state.dom.groupEl);
    rects_1.setRectElRect(rectEl, rect);
};
const addElements = (state, elements) => elements.forEach(el => add(state, el));
const deleteElements = (state, elements) => elements.forEach(el => del(state, el));
const editElementsUndo = (state, elements) => elements.forEach(el => edit(state, el.id, el.previous));
const editElementsRedo = (state, elements) => elements.forEach(el => edit(state, el.id, el.rect));
const redoCommands = {
    add: (state, command) => addElements(state, command.elements),
    delete: (state, command) => deleteElements(state, command.elements),
    edit: (state, command) => editElementsRedo(state, command.elements)
};
const undoCommands = {
    add: (state, command) => deleteElements(state, command.elements),
    delete: (state, command) => addElements(state, command.elements),
    edit: (state, command) => editElementsUndo(state, command.elements)
};

},{"../../lib/dom/util":23,"../actions/select":2,"../dom/rects":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSize = void 0;
exports.handleSize = 3;

},{}],6:[function(require,module,exports){
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

},{"../../lib/dom/h":20,"../types":15}],7:[function(require,module,exports){
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

},{"../../lib/dom/s":22,"../../lib/geometry/rect":31,"../../lib/util":34}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandlePositions = exports.createResizer = void 0;
const s_1 = require("../../lib/dom/s");
const geometry_1 = require("../geometry");
const position_1 = require("../../lib/geometry/position");
const types_1 = require("../../lib/geometry/types");
const consts_1 = require("../consts");
const rects_1 = require("./rects");
exports.createResizer = (bounds, rectId) => {
    const outlineEl = s_1.rect({ class: 'outline', 'data-id': rectId });
    const outlineRect = geometry_1.insideRect(bounds);
    rects_1.setRectElRect(outlineEl, outlineRect);
    const groupEl = s_1.g({ class: 'resizer', 'data-id': rectId }, outlineEl, ...createHandles(bounds, rectId));
    return groupEl;
};
const createHandles = (rect, rectId) => {
    const handles = [];
    types_1.yPositionNames.forEach(yName => {
        const y = position_1.getYPosition(rect, yName);
        types_1.xPositionNames.forEach(xName => {
            if (yName === 'yCenter' && xName === 'xCenter')
                return;
            const x = position_1.getXPosition(rect, xName);
            const handle = createHandle({ x, y }, xName, yName, rectId);
            handles.push(handle);
        });
    });
    return handles;
};
const createHandle = ({ x, y }, xName, yName, rectId) => {
    const width = consts_1.handleSize;
    const height = consts_1.handleSize;
    x -= width / 2;
    y -= height / 2;
    switch (xName) {
        case 'left': x += 1;
        case 'right': x -= 0.5;
    }
    switch (yName) {
        case 'top': y += 1;
        case 'bottom': y -= 0.5;
    }
    const handleEl = s_1.rect({
        class: ['handle', xName, yName].join(' '),
        'data-id': rectId
    });
    rects_1.setRectElRect(handleEl, { x, y, width, height });
    return handleEl;
};
exports.getHandlePositions = (handleEl) => {
    const classes = [...handleEl.classList];
    if (!classes.includes('handle'))
        throw Error('Expected element classes to include handle');
    const xPosition = position_1.findXPosition(classes);
    if (xPosition === undefined)
        throw Error(`Expected element to include one of ${types_1.xPositionNames.join(', ')}`);
    const yPosition = position_1.findYPosition(classes);
    if (yPosition === undefined)
        throw Error(`Expected element to include one of ${types_1.yPositionNames.join(', ')}`);
    const positions = [xPosition, yPosition];
    return positions;
};

},{"../../lib/dom/s":22,"../../lib/geometry/position":29,"../../lib/geometry/types":33,"../consts":5,"../geometry":9,"./rects":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insideRect = exports.applyTransform = exports.ensureMinScale = exports.getLocalCenter = exports.localToGrid = void 0;
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
exports.insideRect = ({ x, y, width, height }, strokeWidth = 1) => {
    x += strokeWidth / 2;
    y += strokeWidth / 2;
    width -= strokeWidth;
    height -= strokeWidth;
    return { x, y, width, height };
};

},{"../lib/dom/geometry":19,"../lib/dom/util":23}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const s_1 = require("../lib/dom/s");
const util_1 = require("../lib/dom/util");
const geometry_1 = require("../lib/dom/geometry");
const grid_bg_1 = require("./image-generators/grid-bg");
const defs_1 = require("../lib/dom/defs");
const io_1 = require("./io");
const tools_1 = require("./tools");
const form_tools_1 = require("./dom/form-tools");
const zoom_1 = require("./actions/zoom");
exports.createApp = (opts = {}) => {
    const options = Object.assign({}, defaultOptions, opts);
    const state = initState(options);
    initResize(state);
    tools_1.initForm(state);
    io_1.initIOEvents(state);
    zoom_1.zoomToFit(state);
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
    const dragData = {
        dragLine: null,
        creatingElId: null,
        draggingRect: null,
        selectingRect: null
    };
    const keys = {};
    const commands = {
        list: [],
        nextIndex: 0
    };
    const state = {
        mode, transform, dom, options, defsManager, dragData, keys, commands
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
    const gridBg = grid_bg_1.createGridBg(cw, ch);
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

},{"../lib/dom/defs":18,"../lib/dom/geometry":19,"../lib/dom/s":22,"../lib/dom/util":23,"./actions/zoom":3,"./dom/form-tools":6,"./image-generators/grid-bg":10,"./io":12,"./tools":14}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIOEvents = void 0;
const util_1 = require("../../lib/dom/util");
const geometry_1 = require("../../lib/dom/geometry");
const line_1 = require("../../lib/geometry/line");
const geometry_2 = require("../geometry");
const key_handler_1 = require("./key-handler");
const util_2 = require("../../lib/util");
const rect_1 = require("../../lib/geometry/rect");
const commands_1 = require("../commands");
const mode_1 = require("../actions/mode");
const zoom_1 = require("../actions/zoom");
const select_1 = require("../actions/select");
const rects_1 = require("../dom/rects");
const pointer_emitter_1 = require("../../lib/events/pointer-emitter");
exports.initIOEvents = (state) => {
    const { dom, options, dragData } = state;
    const { viewportEl, groupEl } = dom;
    const pointerEmitter = pointer_emitter_1.createPointerEmitter(viewportEl);
    viewportEl.addEventListener('wheel', e => {
        e.preventDefault();
        const { left, top } = viewportEl.getBoundingClientRect();
        const { deltaY, clientX, clientY } = e;
        const { scale } = state.transform;
        const x = clientX - left;
        const y = clientY - top;
        const newScale = scale + deltaY * -0.1;
        zoom_1.zoomAt(state, { x, y, scale: newScale });
    });
    window.addEventListener('keydown', e => {
        state.keys[e.key] = true;
        const handled = key_handler_1.keyHandler(state, e.key);
        if (handled)
            e.preventDefault();
    });
    window.addEventListener('keyup', e => {
        state.keys[e.key] = false;
    });
    pointerEmitter.down.on(() => { });
    pointerEmitter.up.on(() => {
        if (dragData.creatingElId) {
            const creatingEl = util_1.strictSelect(`#${dragData.creatingElId}`, state.dom.groupEl);
            const { width, height } = creatingEl;
            if (width.baseVal.value === 0 || height.baseVal.value === 0) {
                creatingEl.remove();
                dragData.creatingElId = null;
                return;
            }
            select_1.selectNone(state);
            select_1.selectRect(state, creatingEl);
            commands_1.newCommand(state, {
                type: 'add',
                elements: [
                    {
                        id: dragData.creatingElId,
                        rect: rects_1.svgRectToRect(creatingEl)
                    }
                ]
            });
            dragData.creatingElId = null;
        }
        dragData.dragLine = null;
        dragData.draggingRect = null;
        dragData.selectingRect = null;
    });
    pointerEmitter.move.on(({ position, isDragging }) => {
        // set cursors here - or use CSS?
        if (!isDragging)
            return;
        const { x: lx, y: ly } = normalizeLocal(state, position);
        if (dragData.dragLine) {
            dragData.dragLine.x2 = lx;
            dragData.dragLine.y2 = ly;
        }
        else {
            dragData.dragLine = { x1: lx, y1: ly, x2: lx, y2: ly };
        }
        if (state.mode === 'pan') {
            const { x: dX, y: dY } = line_1.lineToVector(dragData.dragLine);
            state.transform.x += dX;
            state.transform.y += dY;
            geometry_2.applyTransform(state);
            return;
        }
        if (state.mode === 'draw') {
            let creatingEl;
            if (dragData.creatingElId) {
                creatingEl = util_1.strictSelect(`#${dragData.creatingElId}`, state.dom.groupEl);
            }
            else {
                dragData.creatingElId = util_2.randomId();
                creatingEl = rects_1.createRectEl(dragData.creatingElId);
                groupEl.append(creatingEl);
            }
            const line = line_1.normalizeLine(line_1.snapLineToGrid(dragData.dragLine, options.snap));
            const { x1: x, y1: y } = line;
            let { x: width, y: height } = line_1.lineToVector(line);
            if (state.keys.Shift) {
                const max = Math.max(width, height);
                width = max;
                height = max;
            }
            util_1.attr(creatingEl, { x, y, width, height });
            return;
        }
        if (state.mode === 'select') {
            if (!dragData.draggingRect) {
                const selectedRectEl = rects_1.findRectAt(state, { x: lx, y: ly });
                if (selectedRectEl === undefined)
                    return;
                if (!select_1.isSelected(selectedRectEl))
                    return;
                const { id } = selectedRectEl;
                const initialRect = rects_1.svgRectToRect(selectedRectEl);
                dragData.draggingRect = { initialRect, id };
                return;
            }
            const selectedRectEl = util_1.strictSelect(`#${dragData.draggingRect.id}`);
            const line = line_1.snapLineToGrid(dragData.dragLine, options.snap);
            const delta = line_1.lineToVector(line);
            const newRectElRect = rect_1.translateRect(dragData.draggingRect.initialRect, delta);
            rects_1.setRectElRect(selectedRectEl, newRectElRect);
            // now translate selection as well
            // TODO: this is lazy and bad lol
            select_1.selectNone(state);
            select_1.selectRect(state, selectedRectEl);
            return;
        }
    });
    pointerEmitter.tap.on(({ position }) => {
        const localPosition = normalizeLocal(state, position);
        const selectedRectEl = rects_1.findRectAt(state, localPosition);
        if (state.mode === 'pan') {
            select_1.selectNone(state);
            return;
        }
        if (state.mode === 'draw' && selectedRectEl !== undefined) {
            select_1.selectNone(state);
            select_1.selectRect(state, selectedRectEl);
            mode_1.switchMode(state, 'select');
            return;
        }
        if (state.mode === 'select') {
            const selectedRectEl = rects_1.findRectAt(state, localPosition);
            if (selectedRectEl === undefined) {
                select_1.selectNone(state);
            }
            else {
                if (state.keys.Shift) {
                    select_1.toggleRect(state, selectedRectEl);
                }
                else {
                    select_1.selectNone(state);
                    select_1.selectRect(state, selectedRectEl);
                }
            }
            return;
        }
    });
};
const normalizeLocal = (state, { x, y }) => {
    const viewBoxRect = geometry_1.getViewBoxRect(state.dom.svgEl);
    return geometry_2.localToGrid(x, y, state.transform, viewBoxRect);
};

},{"../../lib/dom/geometry":19,"../../lib/dom/util":23,"../../lib/events/pointer-emitter":25,"../../lib/geometry/line":26,"../../lib/geometry/rect":31,"../../lib/util":34,"../actions/mode":1,"../actions/select":2,"../actions/zoom":3,"../commands":4,"../dom/rects":7,"../geometry":9,"./key-handler":13}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyHandler = void 0;
const mode_1 = require("../actions/mode");
const select_1 = require("../actions/select");
const zoom_1 = require("../actions/zoom");
const commands_1 = require("../commands");
const geometry_1 = require("../geometry");
exports.keyHandler = (state, key) => {
    const { options } = state;
    if (isResetZoom(key)) {
        zoom_1.zoomToFit(state);
        return true;
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
        zoom_1.zoomAt(state, { x, y, scale });
        return true;
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
        return true;
    }
    if (isDelete(key)) {
        // ...
        return true;
    }
    if (isUndoRedo(key) && state.keys.Control) {
        if (state.keys.Shift) {
            commands_1.redoCommand(state);
        }
        else {
            commands_1.undoCommand(state);
        }
        return true;
    }
    if (isSelectAllNone(key) && state.keys.Control) {
        if (state.keys.Shift) {
            select_1.selectNone(state);
        }
        else {
            select_1.selectAll(state);
        }
        mode_1.switchMode(state, 'select');
        return true;
    }
    return false;
};
const isResetZoom = (key) => key === '*';
const isDelete = (key) => key === 'Delete';
const isZoom = (key) => ['-', '+'].includes(key);
const isMove = (key) => ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
const isUndoRedo = (key) => key.toLowerCase() === 'z';
const isSelectAllNone = (key) => key.toLowerCase() === 'a';

},{"../actions/mode":1,"../actions/select":2,"../actions/zoom":3,"../commands":4,"../geometry":9}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initForm = void 0;
const util_1 = require("../lib/dom/util");
const mode_1 = require("./actions/mode");
const zoom_1 = require("./actions/zoom");
const commands_1 = require("./commands");
exports.initForm = (state) => {
    const { options } = state;
    const { formEl } = state.dom;
    const modeEl = util_1.strictFormElement(formEl, 'mode');
    const cellWidthEl = util_1.strictFormElement(formEl, 'cellWidth');
    const cellHeightEl = util_1.strictFormElement(formEl, 'cellHeight');
    formEl.addEventListener('change', () => {
        const newMode = modeEl.value;
        if (mode_1.isAppMode(newMode)) {
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
    resetZoomButtonEl.addEventListener('click', () => zoom_1.zoomToFit(state));
    const undoButtonEl = util_1.strictSelect('#undo', formEl);
    undoButtonEl.addEventListener('click', () => commands_1.undoCommand(state));
    const redoButtonEl = util_1.strictSelect('#redo', formEl);
    redoButtonEl.addEventListener('click', () => commands_1.redoCommand(state));
    modeEl.value = 'pan';
    cellWidthEl.value = String(options.snap.width);
    cellHeightEl.value = String(options.snap.height);
};

},{"../lib/dom/util":23,"./actions/mode":1,"./actions/zoom":3,"./commands":4}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appModes = void 0;
exports.appModes = ['pan', 'draw', 'select'];

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.createApp();

},{"./app":11}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgNs = void 0;
exports.svgNs = 'http://www.w3.org/2000/svg';

},{}],18:[function(require,module,exports){
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

},{"./s":22,"./util":23}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setViewBox = exports.getViewBoxRect = exports.transformToSvg = void 0;
const util_1 = require("./util");
exports.transformToSvg = ({ x, y, scale }) => `translate(${x} ${y}) scale(${scale})`;
exports.getViewBoxRect = (svg) => svg.viewBox.baseVal;
exports.setViewBox = (svg, { x, y, width, height }) => {
    util_1.attr(svg, { viewBox: [x, y, width, height].join(' ') });
};

},{"./util":23}],20:[function(require,module,exports){
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

},{"./predicates":21,"./util":23}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSVGElement = exports.isElement = exports.isNode = void 0;
const consts_1 = require("./consts");
exports.isNode = (value) => value && typeof value['nodeType'] === 'number';
exports.isElement = (value) => value && value['nodeType'] === 1;
exports.isSVGElement = (value) => exports.isElement(value) && value.namespaceURI === consts_1.svgNs;

},{"./consts":17}],22:[function(require,module,exports){
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

},{"./consts":17,"./predicates":21,"./util":23}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPointerEmitter = void 0;
const _1 = require(".");
const line_1 = require("../geometry/line");
const rect_1 = require("../geometry/rect");
exports.createPointerEmitter = (target, options = {}) => {
    const { preventDefault, tapDistanceThreshold, tapDelay } = Object.assign({}, defaultOptions, options);
    const down = _1.createEmitter();
    const up = _1.createEmitter();
    const move = _1.createEmitter();
    const tap = _1.createEmitter();
    let isDragging = false;
    let isAttached = false;
    let lastTime;
    let lastPosition;
    const downListener = (e) => {
        isDragging = true;
        const event = createEvent(e);
        const { x, y } = event.position;
        lastPosition = { x, y };
        lastTime = Date.now();
        down.emit(event);
    };
    const upListener = (e) => {
        const wasDragging = isDragging;
        const event = createEvent(e);
        if (wasDragging || event.isInside) {
            up.emit(event);
        }
        if (lastPosition != null) {
            const nowTime = Date.now();
            const delta = nowTime - lastTime;
            const { x: x1, y: y1 } = event.position;
            const { x: x2, y: y2 } = lastPosition;
            const dist = line_1.distance({ x1, y1, x2, y2 });
            if (delta <= tapDelay && dist < tapDistanceThreshold) {
                tap.emit(event);
            }
            lastPosition = null;
        }
        isDragging = false;
    };
    const moveListener = (e) => {
        const event = createEvent(e);
        const bounds = target.getBoundingClientRect();
        const isInside = rect_1.rectContainsPoint(bounds, event.position);
        if (isInside) {
            isDragging = true;
        }
        if (isDragging || event.isInside) {
            move.emit(event);
        }
    };
    const enable = () => {
        if (isAttached)
            return;
        target.addEventListener('mousedown', downListener);
        window.addEventListener('mouseup', upListener);
        window.addEventListener('mousemove', moveListener);
        if (preventDefault) {
            window.addEventListener('dragstart', preventDefaultListener, { passive: false });
            document.addEventListener('touchmove', preventDefaultListener, { passive: false });
        }
        isAttached = true;
    };
    const preventDefaultListener = (event) => {
        event.preventDefault();
        return false;
    };
    const disable = () => {
        if (!isAttached)
            return;
        target.removeEventListener('mousedown', downListener);
        window.removeEventListener('mouseup', upListener);
        window.removeEventListener('mousemove', moveListener);
        if (preventDefault) {
            window.removeEventListener('dragstart', preventDefaultListener);
            document.removeEventListener('touchmove', preventDefaultListener);
        }
        isAttached = false;
    };
    const createEvent = (mouseEvent) => {
        const bounds = target.getBoundingClientRect();
        const position = getPosition(mouseEvent, bounds);
        const isInside = rect_1.rectContainsPoint(bounds, position);
        const event = { position, isDragging, isInside };
        return event;
    };
    enable();
    return { up, down, move, tap, enable, disable };
};
const getPosition = (event, bounds) => {
    const { clientX, clientY } = event;
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    const point = { x, y };
    return point;
};
const defaultOptions = {
    preventDefault: true,
    tapDistanceThreshold: 10,
    tapDelay: 300
};

},{".":24,"../geometry/line":26,"../geometry/rect":31}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = exports.snapLineToGrid = exports.lineToArgs = exports.argsToLine = exports.normalizeLine = exports.lineToVector = void 0;
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
exports.distance = (line) => {
    const { x, y } = exports.lineToVector(line);
    return Math.sqrt(x * x + y * y);
};

},{"./number":27}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapToGrid = void 0;
exports.snapToGrid = (value, grid) => Math.floor(value / grid) * grid;

},{}],28:[function(require,module,exports){
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

},{"./number":27}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findYPosition = exports.findXPosition = exports.getYPosition = exports.getXPosition = void 0;
const predicates_1 = require("./predicates");
exports.getXPosition = ({ x, width }, position) => {
    switch (position) {
        case 'left': return x;
        case 'right': return x + width;
        case 'xCenter': return x + width / 2;
    }
};
exports.getYPosition = ({ y, height }, position) => {
    switch (position) {
        case 'top': return y;
        case 'bottom': return y + height;
        case 'yCenter': return y + height / 2;
    }
};
exports.findXPosition = (values) => {
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (predicates_1.isXPosition(value))
            return value;
    }
};
exports.findYPosition = (values) => {
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        if (predicates_1.isYPosition(value))
            return value;
    }
};

},{"./predicates":30}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYPosition = exports.isXPosition = void 0;
const types_1 = require("./types");
exports.isXPosition = (value) => types_1.xPositionNames.includes(value);
exports.isYPosition = (value) => types_1.yPositionNames.includes(value);

},{"./types":33}],31:[function(require,module,exports){
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

},{"./point":28}],32:[function(require,module,exports){
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

},{"./point":28}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.positionNames = exports.yPositionNames = exports.xPositionNames = exports.sideNames = exports.centerNames = exports.ySideNames = exports.xSideNames = exports.YCENTER = exports.XCENTER = exports.BOTTOM = exports.TOP = exports.RIGHT = exports.LEFT = void 0;
exports.LEFT = 'left';
exports.RIGHT = 'right';
exports.TOP = 'top';
exports.BOTTOM = 'bottom';
exports.XCENTER = 'xCenter';
exports.YCENTER = 'yCenter';
exports.xSideNames = [exports.LEFT, exports.RIGHT];
exports.ySideNames = [exports.TOP, exports.BOTTOM];
exports.centerNames = [exports.XCENTER, exports.YCENTER];
exports.sideNames = [...exports.xSideNames, ...exports.ySideNames];
exports.xPositionNames = [exports.LEFT, exports.XCENTER, exports.RIGHT];
exports.yPositionNames = [exports.TOP, exports.YCENTER, exports.BOTTOM];
exports.positionNames = [...exports.xPositionNames, ...exports.yPositionNames];

},{}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequence = exports.randomInt = exports.randomChar = exports.randomId = void 0;
exports.randomId = () => exports.createSequence(16, exports.randomChar).join('');
exports.randomChar = () => String.fromCharCode(exports.randomInt(26) + 97);
exports.randomInt = (exclMax) => Math.floor(Math.random() * exclMax);
exports.createSequence = (length, cb) => Array.from({ length }, (_v, index) => cb(index));

},{}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./fitter":35,"./predicates":37,"./transform-fitted-point":38}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
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

},{"./fitter":35}]},{},[16]);
