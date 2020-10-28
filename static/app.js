(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const start_app_1 = require("../controllers/app/start-app");
exports.createApp = () => {
    start_app_1.startApp(options);
};
const options = {
    gridSize: { width: 1000, height: 1000 },
    cellSize: { width: 16, height: 16 },
    minScale: 0.1,
    snap: { width: 2, height: 2 },
};

},{"../controllers/app/start-app":8}],2:[function(require,module,exports){
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
    const highlight = [255, 255, 255, 255];
    const body = [223, 223, 223, 255];
    const shadow = [191, 191, 191, 255];
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

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppActions = void 0;
const geometry_1 = require("../../geometry");
exports.createAppActions = (state, getDocumentState, options) => {
    const actions = {
        zoomToFit: () => {
            const viewportSize = state.get.viewportSize();
            const transform = geometry_1.zoomToFit(viewportSize, getDocumentState.gridSize());
            state.set.viewportTransform(transform);
        },
        zoomAt: (transform) => {
            const viewportTransform = state.get.viewportTransform();
            transform = geometry_1.zoomAt(viewportTransform, transform, options.minScale);
            state.set.viewportTransform(transform);
        }
    };
    return actions;
};

},{"../../geometry":21}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppController = void 0;
const state_1 = require("../../lib/state");
const app_state_1 = require("./app-state");
const app_view_1 = require("./app-view");
exports.createAppController = (options) => {
    const appState = app_state_1.createAppState();
    const appView = app_view_1.createAppView(options);
    state_1.pipeState(appState.on, appView.render);
    return { appState, appView };
};

},{"../../lib/state":49,"./app-state":6,"./app-view":7}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAppHandler = void 0;
const drag_emitter_1 = require("../../lib/events/drag-emitter");
const line_1 = require("../../lib/geometry/line");
const transform_1 = require("../../lib/geometry/transform");
exports.startAppHandler = ({ viewportEl }, state, actions) => {
    const getTransform = () => state.get.viewportTransform();
    const getMode = () => state.get.appMode();
    resizeEvents(viewportEl, state.set.viewportSize);
    wheelEvents(viewportEl, getTransform, actions.zoomAt);
    pointerEvents(viewportEl, getTransform, getMode, state.set.viewportTransform);
};
const resizeEvents = (viewportEl, setViewportSize) => {
    const resizeEvent = new Event('resize');
    window.addEventListener('resize', () => {
        const { width, height } = viewportEl.getBoundingClientRect();
        setViewportSize({ width, height });
    });
    window.dispatchEvent(resizeEvent);
};
const wheelEvents = (viewportEl, getTransform, zoomAt) => {
    viewportEl.addEventListener('wheel', e => {
        e.preventDefault();
        const { left, top } = viewportEl.getBoundingClientRect();
        const { deltaY, clientX, clientY } = e;
        const { scale } = getTransform();
        const x = clientX - left;
        const y = clientY - top;
        const newScale = scale + deltaY * -0.1;
        zoomAt({ x, y, scale: newScale });
    });
};
const pointerEvents = (viewportEl, getTransform, getMode, setTransform) => {
    const transformPoint = (p) => transform_1.translateAndScalePoint(p, getTransform());
    const emitter = drag_emitter_1.createDragEmitter(viewportEl, { transformPoint });
    emitter.dragging.on(line => {
        if (getMode() !== 'pan')
            return;
        let transform = getTransform();
        const { x: dX, y: dY } = line_1.lineToVector(line);
        transform.x += dX;
        transform.y += dY;
        setTransform(transform);
    });
};

},{"../../lib/events/drag-emitter":35,"../../lib/geometry/line":38,"../../lib/geometry/transform":44}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppState = void 0;
const state_1 = require("../../lib/state");
const types_1 = require("./types");
exports.createAppState = () => {
    const state = state_1.createEventedState(state_1.createState(types_1.appModelKeys), state_1.createEvents(types_1.appModelKeys));
    return state;
};

},{"../../lib/state":49,"./types":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppView = void 0;
const geometry_1 = require("../../geometry");
const geometry_2 = require("../../lib/dom/geometry");
const util_1 = require("../../lib/dom/util");
exports.createAppView = (options) => {
    const viewportEl = util_1.strictSelect('#viewport');
    const { svgEl, groupEl } = options.elements;
    viewportEl.append(svgEl);
    const render = {
        appMode: () => {
            // does nothing, passed to tools-view
        },
        snapSize: () => {
            // does nothing, passed to tools-view
        },
        viewportSize: ({ width, height }) => {
            geometry_2.setViewBox(svgEl, { x: 0, y: 0, width, height });
        },
        viewportTransform: transform => {
            geometry_1.applyTransform(groupEl, transform, options.minScale);
        }
    };
    const elements = { viewportEl };
    const appView = { render, elements };
    return appView;
};

},{"../../geometry":21,"../../lib/dom/geometry":30,"../../lib/dom/util":34}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const document_actions_1 = require("../document/document-actions");
const document_controller_1 = require("../document/document-controller");
const document_handler_1 = require("../document/document-handler");
const start_tools_1 = require("../tools/start-tools");
const app_actions_1 = require("./app-actions");
const app_controller_1 = require("./app-controller");
const app_handler_1 = require("./app-handler");
exports.startApp = (options) => {
    const { documentState, rectCollection, documentView } = document_controller_1.createDocumentController();
    const { appState, appView } = app_controller_1.createAppController(createAppViewOptions(options, documentView.elements));
    const appActions = app_actions_1.createAppActions(appState, documentState.get, options);
    const documentActions = document_actions_1.createDocumentActions(documentState, rectCollection);
    /*
      order is important - startTools must be called first - if it is wrong, the
      offsets when drawing will be incorrect, and the viewport will initially be
      sized incorrectly - should figure out exactly why and see if we can enforce
      the order in code
    */
    start_tools_1.startTools(appState, appActions, documentActions);
    document_handler_1.startDocumentHandler(documentView.render, rectCollection, documentActions, appState);
    app_handler_1.startAppHandler(appView.elements, appState, appActions);
    appState.set.appMode('pan');
    appState.set.snapSize(options.snap);
    documentState.set.gridSize(options.gridSize);
    documentState.set.cellSize(options.cellSize);
    appActions.zoomToFit();
};
const createAppViewOptions = (options, elements) => Object.assign({}, options, { elements });

},{"../document/document-actions":11,"../document/document-controller":12,"../document/document-handler":13,"../tools/start-tools":19,"./app-actions":3,"./app-controller":4,"./app-handler":5}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appModes = exports.appModelKeys = void 0;
exports.appModelKeys = [
    'appMode',
    'snapSize',
    'viewportSize',
    'viewportTransform'
];
exports.appModes = ['pan', 'draw', 'select'];

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppMode = void 0;
const types_1 = require("./types");
exports.isAppMode = (value) => types_1.appModes.includes(value);

},{"./types":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentActions = void 0;
const select_1 = require("../../lib/select");
exports.createDocumentActions = (documentState, rectCollection) => {
    const selector = select_1.createSelector();
    const { undo: u, redo: r, toStart, toEnd, forward, back } = rectCollection;
    const undo = () => {
        selector.actions.clear();
        u();
    };
    const redo = () => {
        selector.actions.clear();
        r();
    };
    const { actions: selection } = selector;
    const documentActions = {
        undo, redo, toStart, toEnd, forward, back, selection
    };
    selector.on(documentState.set.selection);
    return documentActions;
};

},{"../../lib/select":48}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentController = void 0;
const state_1 = require("../../lib/state");
const document_state_1 = require("./document-state");
const document_view_1 = require("./document-view");
exports.createDocumentController = () => {
    const { documentState, rectCollection } = document_state_1.createDocumentState();
    const documentView = document_view_1.createDocumentView();
    state_1.pipeStatePartial(documentState.on, documentView.render);
    rectCollection.on.add(documentView.render.createRects);
    rectCollection.on.update(documentView.render.updateRects);
    rectCollection.on.remove(documentView.render.removeRects);
    rectCollection.on.setOrder(documentView.render.orderRects);
    return { documentState, rectCollection, documentView };
};

},{"../../lib/state":49,"./document-state":14,"./document-view":15}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDocumentHandler = void 0;
const geometry_1 = require("../../lib/dom/geometry");
const s_1 = require("../../lib/dom/s");
const util_1 = require("../../lib/dom/util");
const drag_emitter_1 = require("../../lib/events/drag-emitter");
const pointer_emitter_1 = require("../../lib/events/pointer-emitter");
const line_1 = require("../../lib/geometry/line");
const point_1 = require("../../lib/geometry/point");
const rect_1 = require("../../lib/geometry/rect");
const transform_1 = require("../../lib/geometry/transform");
const keys_1 = require("../../lib/keys");
const util_2 = require("../../lib/util");
exports.startDocumentHandler = (render, rectCollection, documentActions, appState) => {
    drawEvents(render, rectCollection, appState.get);
    keyEvents(rectCollection, documentActions);
    selectEvents(documentActions, appState);
};
const drawEvents = (render, rectCollection, getState) => {
    const viewportEl = util_1.strictSelect('#viewport');
    const getMode = () => getState.appMode();
    const transformPoint = createSnappedTransformPoint(getState);
    const drag = drag_emitter_1.createDragEmitter(viewportEl, { transformPoint });
    let rectModel = null;
    drag.start.on(line => {
        if (getMode() !== 'draw')
            return;
        const id = util_2.randomId();
        const rect = lineToRect(line);
        rectModel = { id, rect };
        render.createRects([rectModel]);
    });
    drag.dragging.on(line => {
        if (getMode() !== 'draw')
            return;
        if (rectModel === null)
            throw Error('Expected rectModel');
        rectModel.rect = lineToRect(line);
        render.updateRects([rectModel]);
    });
    drag.end.on(() => {
        if (getMode() !== 'draw')
            return;
        if (rectModel === null)
            throw Error('Expected rectMessage');
        render.removeRects([rectModel.id]);
        const { width, height } = rectModel.rect;
        if (width >= 1 && height >= 1) {
            rectCollection.add([rectModel]);
        }
        rectModel = null;
    });
};
const selectEvents = (documentActions, appState) => {
    const { get: getState } = appState;
    const viewportEl = util_1.strictSelect('#viewport');
    const groupEl = util_1.strictSelect('svg > g', viewportEl);
    const pointerEvents = pointer_emitter_1.createPointerEmitter(viewportEl);
    const dragEvents = drag_emitter_1.createDragEmitter(viewportEl);
    const transformPoint = createTransformPoint(getState);
    const panTap = () => {
        documentActions.selection.clear();
    };
    const drawTap = (point) => {
        const rectIds = rectIdsAt(viewportEl, point);
        if (rectIds.length === 0) {
            // TODO: prompt for dimensions
            return;
        }
        appState.set.appMode('select');
        selectTap(point);
    };
    const selectTap = (point) => {
        const rectIds = rectIdsAt(viewportEl, point);
        if (rectIds.length === 0) {
            documentActions.selection.clear();
            return;
        }
        const last = rectIds[rectIds.length - 1];
        if (keys_1.keys.Shift) {
            documentActions.selection.toggle([last]);
        }
        else {
            documentActions.selection.clear();
            documentActions.selection.add([last]);
        }
    };
    pointerEvents.tap.on(({ position, button }) => {
        // TODO - add right click handler here
        if (button !== 0)
            return;
        if (getState.appMode() === 'pan') {
            panTap();
            return;
        }
        const point = transformPoint(position);
        if (getState.appMode() === 'draw') {
            drawTap(point);
            return;
        }
        if (getState.appMode() === 'select') {
            selectTap(point);
            return;
        }
    });
    let selectRectEl = null;
    dragEvents.start.on(line => {
        if (documentActions.selection.any()) {
            // TODO drag to move
            return;
        }
        const lineRect = lineToRect(line);
        selectRectEl = s_1.rect({ class: 'selectRectEl' }, lineRect);
        groupEl.append(selectRectEl);
    });
    dragEvents.dragging.on(line => {
        if (documentActions.selection.any()) {
            // TODO drag to move
            return;
        }
        if (selectRectEl === null)
            throw Error('Expected selectRectEl');
        const lineRect = lineToRect(line);
        util_1.attr(selectRectEl, lineRect);
    });
    dragEvents.end.on(() => {
        if (documentActions.selection.any()) {
            // TODO drag to move
            return;
        }
        // select all in rect
        selectRectEl === null || selectRectEl === void 0 ? void 0 : selectRectEl.remove();
        selectRectEl = null;
    });
};
const keyEvents = (rectCollection, documentActions) => {
    const viewportEl = util_1.strictSelect('#viewport');
    document.addEventListener('keydown', e => {
        if (keys_1.keys.Control && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            keys_1.keys.Shift ? documentActions.redo() : documentActions.undo();
            return;
        }
        if (keys_1.keys.Control && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            documentActions.selection.clear();
            if (!keys_1.keys.Shift) {
                documentActions.selection.add(getAllRectIds(viewportEl));
            }
        }
        if (e.key === 'Delete') {
            const selectedIds = documentActions.selection.get();
            if (selectedIds.length === 0)
                return;
            rectCollection.remove(selectedIds);
            documentActions.selection.clear();
        }
    });
};
const lineToRect = (line) => {
    const normal = line_1.normalizeLine(line);
    const { x, y } = line_1.getStart(normal);
    const { x: width, y: height } = line_1.lineToVector(normal);
    const rect = { x, y, width, height };
    return rect;
};
const getAllRectEls = (viewportEl) => {
    const rectEls = viewportEl.querySelectorAll('.rectEl');
    return [...rectEls];
};
const getAllRectIds = (viewportEl) => getAllRectEls(viewportEl).map(el => el.id);
const createSnappedTransformPoint = (getState) => (point) => point_1.snapPointToGrid(transform_1.translateAndScalePoint(point, getState.viewportTransform()), getState.snapSize());
const createTransformPoint = (getState) => (point) => transform_1.translateAndScalePoint(point, getState.viewportTransform());
// if multiple ids, the last one is topmost
const rectIdsAt = (viewportEl, point) => {
    const ids = [];
    const rectEls = getAllRectEls(viewportEl);
    rectEls.forEach(el => {
        const rect = geometry_1.getRectElRect(el);
        if (rect_1.rectContainsPoint(rect, point)) {
            ids.push(el.id);
        }
    });
    return ids;
};

},{"../../lib/dom/geometry":30,"../../lib/dom/s":33,"../../lib/dom/util":34,"../../lib/events/drag-emitter":35,"../../lib/events/pointer-emitter":37,"../../lib/geometry/line":38,"../../lib/geometry/point":40,"../../lib/geometry/rect":43,"../../lib/geometry/transform":44,"../../lib/keys":46,"../../lib/util":50}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentState = void 0;
const collection_1 = require("../../lib/collection");
const state_1 = require("../../lib/state");
const types_1 = require("./types");
exports.createDocumentState = () => {
    const rectCollection = collection_1.createCollection();
    const state = state_1.createState(types_1.documentStateKeys);
    const events = state_1.createEvents(types_1.documentStateKeys);
    const documentState = state_1.createEventedState(state, events);
    return { rectCollection, documentState };
};

},{"../../lib/collection":24,"../../lib/state":49,"./types":17}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGridBg = exports.createDocumentView = void 0;
const create_grid_bg_1 = require("../../canvas/grid-bg/create-grid-bg");
const geometry_1 = require("../../geometry");
const defs_1 = require("../../lib/dom/defs");
const geometry_2 = require("../../lib/dom/geometry");
const s_1 = require("../../lib/dom/s");
const util_1 = require("../../lib/dom/util");
const resizer_1 = require("./resizer");
exports.createDocumentView = () => {
    const svgEl = s_1.svg();
    const groupEl = s_1.g();
    const defsManager = defs_1.createDefsManager(svgEl);
    const gridRectEl = s_1.rect({ class: 'grid', fill: 'pink' });
    svgEl.append(groupEl);
    groupEl.append(gridRectEl);
    const render = {
        createRects: rects => {
            rects.forEach(({ id, rect }) => {
                groupEl.append(createRectEl(id, rect));
            });
        },
        updateRects: rects => {
            rects.forEach(({ id, rect }) => {
                updateRectEl(groupEl, id, rect);
            });
        },
        removeRects: ids => {
            ids.forEach(id => removeRectEl(groupEl, id));
        },
        orderRects: ids => {
            ids.forEach(id => {
                const existing = getRectEl(groupEl, id);
                groupEl.append(existing);
            });
        },
        gridSize: size => {
            util_1.attr(gridRectEl, size);
        },
        cellSize: size => {
            exports.updateGridBg(defsManager, gridRectEl, size);
        },
        selection: ids => {
            const currentResizer = groupEl.querySelector('.resizer');
            const currentlySelected = groupEl.querySelectorAll('.selected');
            const rectEls = ids.map(id => getRectEl(groupEl, id));
            const rects = rectEls.map(el => geometry_2.getRectElRect(el));
            const bounds = geometry_1.getBoundingRect(rects);
            if (currentResizer !== null)
                currentResizer.remove();
            currentlySelected.forEach(el => el.classList.remove('selected'));
            rectEls.forEach(el => el.classList.add('selected'));
            if (bounds) {
                const resizeEl = resizer_1.createResizer(bounds);
                groupEl.append(resizeEl);
            }
        }
    };
    const elements = { svgEl, groupEl, gridRectEl };
    const documentView = {
        render, elements
    };
    return documentView;
};
exports.updateGridBg = (defsManager, gridRectEl, cellSize) => {
    const { width, height } = cellSize;
    let gridBgCanvas = defsManager.get('gridBg');
    if (gridBgCanvas) {
        const { width: cw, height: ch } = gridBgCanvas;
        if (width === cw && height === ch)
            return;
    }
    gridBgCanvas = create_grid_bg_1.createGridBg(width, height);
    defsManager.setPattern('gridBg', gridBgCanvas);
    util_1.attr(gridRectEl, { fill: 'url(#gridBg)' });
};
const createRectEl = (id, { x, y, width, height }) => s_1.rect({ id, class: 'rectEl', x, y, width, height });
const getRectEl = (groupEl, id) => util_1.strictSelect(`#${id}`, groupEl);
const updateRectEl = (groupEl, id, rect) => util_1.attr(getRectEl(groupEl, id), rect);
const removeRectEl = (groupEl, id) => getRectEl(groupEl, id).remove();

},{"../../canvas/grid-bg/create-grid-bg":2,"../../geometry":21,"../../lib/dom/defs":29,"../../lib/dom/geometry":30,"../../lib/dom/s":33,"../../lib/dom/util":34,"./resizer":16}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHandlePositions = exports.createResizer = void 0;
const geometry_1 = require("../../geometry");
const geometry_2 = require("../../lib/dom/geometry");
const s_1 = require("../../lib/dom/s");
const position_1 = require("../../lib/geometry/position");
const types_1 = require("../../lib/geometry/types");
const handleSize = 8;
exports.createResizer = (bounds) => {
    const outlineEl = s_1.rect({ class: 'outline' });
    const outlineRect = geometry_1.insideRect(bounds);
    geometry_2.setRectElRect(outlineEl, outlineRect);
    const groupEl = s_1.g({ class: 'resizer' }, outlineEl, ...createHandles(bounds));
    return groupEl;
};
const createHandles = (rect) => {
    const handles = [];
    types_1.yPositionNames.forEach(yName => {
        const y = position_1.getYPosition(rect, yName);
        types_1.xPositionNames.forEach(xName => {
            if (yName === 'yCenter' && xName === 'xCenter')
                return;
            const x = position_1.getXPosition(rect, xName);
            const handle = createHandle({ x, y }, xName, yName);
            handles.push(handle);
        });
    });
    return handles;
};
const createHandle = ({ x, y }, xName, yName) => {
    const width = handleSize;
    const height = handleSize;
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
        class: ['handle', xName, yName].join(' ')
    });
    geometry_2.setRectElRect(handleEl, { x, y, width, height });
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

},{"../../geometry":21,"../../lib/dom/geometry":30,"../../lib/dom/s":33,"../../lib/geometry/position":41,"../../lib/geometry/types":45}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentViewKeys = exports.documentStateKeys = void 0;
const types_1 = require("../rect/types");
exports.documentStateKeys = [
    'selection',
    'gridSize',
    'cellSize'
];
exports.documentViewKeys = [
    ...types_1.rectModelKeys, ...exports.documentStateKeys
];

},{"../rect/types":18}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rectModelKeys = void 0;
exports.rectModelKeys = [
    'createRects', 'updateRects', 'removeRects', 'orderRects'
];

},{}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTools = void 0;
const state_1 = require("../../lib/state");
const tools_view_1 = require("./tools-view");
exports.startTools = (appState, appActions, documentActions) => {
    const toolsView = tools_view_1.createToolsView(appState.set, appActions, documentActions);
    state_1.pipeStatePartial(appState.on, toolsView);
};

},{"../../lib/state":49,"./tools-view":20}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToolsView = void 0;
const h_1 = require("../../lib/dom/h");
const util_1 = require("../../lib/dom/util");
const types_1 = require("../app/types");
const util_2 = require("../app/util");
exports.createToolsView = (setAppState, appActions, documentActions) => {
    const sectionEl = util_1.strictSelect('#tools');
    const formEl = h_1.form(...createToolbar());
    sectionEl.append(formEl);
    const modeEl = util_1.strictFormElement(formEl, 'mode');
    const snapWidthEl = util_1.strictFormElement(formEl, 'cellWidth');
    const snapHeightEl = util_1.strictFormElement(formEl, 'cellHeight');
    const render = {
        appMode: mode => {
            modeEl.value = mode;
        },
        snapSize: ({ width, height }) => {
            snapWidthEl.value = String(width);
            snapHeightEl.value = String(height);
        }
    };
    formEl.addEventListener('change', () => {
        const mode = modeEl.value;
        if (util_2.isAppMode(mode)) {
            setAppState.appMode(mode);
        }
        const width = parseInt(snapWidthEl.value, 10);
        const height = parseInt(snapHeightEl.value, 10);
        setAppState.snapSize({ width, height });
    });
    const resetZoomButton = util_1.strictSelect('#resetZoom', formEl);
    resetZoomButton.addEventListener('click', () => {
        appActions.zoomToFit();
    });
    const undoButton = util_1.strictSelect('#undo', formEl);
    const redoButton = util_1.strictSelect('#redo', formEl);
    undoButton.addEventListener('click', () => {
        documentActions.undo();
    });
    redoButton.addEventListener('click', () => {
        documentActions.redo();
    });
    return render;
};
const createToolbar = () => [
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

},{"../../lib/dom/h":31,"../../lib/dom/util":34,"../app/types":9,"../app/util":10}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoundingRect = exports.zoomAt = exports.zoomToFit = exports.insideRect = exports.applyTransform = exports.ensureMinScale = exports.getLocalCenter = void 0;
const object_fit_math_1 = require("object-fit-math");
const geometry_1 = require("./lib/dom/geometry");
const util_1 = require("./lib/dom/util");
const transform_1 = require("./lib/geometry/transform");
exports.getLocalCenter = (element) => {
    const { width, height } = element.getBoundingClientRect();
    const x = width / 2;
    const y = height / 2;
    return { x, y };
};
exports.ensureMinScale = (transform, minScale) => {
    if (transform.scale < minScale)
        transform.scale = minScale;
};
exports.applyTransform = (element, transform, minScale) => {
    exports.ensureMinScale(transform, minScale);
    util_1.attr(element, { transform: geometry_1.transformToSvg(transform) });
};
exports.insideRect = ({ x, y, width, height }, strokeWidth = 1) => {
    x += strokeWidth / 2;
    y += strokeWidth / 2;
    width -= strokeWidth;
    height -= strokeWidth;
    return { x, y, width, height };
};
exports.zoomToFit = (parent, child) => {
    const { x: fx, y: fy, width: fw } = object_fit_math_1.fitAndPosition(parent, child, 'contain', '50%', '50%');
    const scale = fw / child.width;
    const x = fx / scale;
    const y = fy / scale;
    const transform = { x, y, scale };
    return transform;
};
exports.zoomAt = (transform, { scale, x, y }, minScale) => {
    if (scale < minScale)
        scale = minScale;
    const newTransform = transform_1.transformRelativeTo(transform, scale, { x, y });
    return Object.assign({}, transform, newTransform);
};
exports.getBoundingRect = (rects) => {
    if (rects.length === 0)
        return;
    const [first, ...rest] = rects;
    let { x: left, y: top } = first;
    let right = left + first.width;
    let bottom = top + first.height;
    rest.forEach(rect => {
        const { x: rx, y: ry, width: rw, height: rh } = rect;
        const rr = rx + rw;
        const rb = ry + rh;
        if (rx < left)
            left = rx;
        if (ry < top)
            top = ry;
        if (rr > right)
            right = rr;
        if (rb > bottom)
            bottom = rb;
    });
    const x = left;
    const y = top;
    const width = right - left;
    const height = bottom - top;
    return { x, y, width, height };
};

},{"./lib/dom/geometry":30,"./lib/dom/util":34,"./lib/geometry/transform":44,"object-fit-math":55}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.createApp();

},{"./app":1}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redoCommand = exports.undoCommand = void 0;
exports.undoCommand = ({ addOne, removeOne, updateOne, setOrder }, events, command) => {
    if (command.type === 'add') {
        const ids = command.elements.map(el => el.id);
        ids.forEach(removeOne);
        events.remove.emit(ids);
    }
    if (command.type === 'remove') {
        command.elements.forEach(addOne);
        setOrder(command.before);
        events.add.emit(command.elements);
        events.setOrder.emit(command.before);
    }
    if (command.type === 'update') {
        const values = command.elements.map(el => el.prev);
        values.forEach(updateOne);
        events.update.emit(values);
    }
    if (command.type === 'order') {
        setOrder(command.before);
        events.setOrder.emit(command.before);
    }
};
exports.redoCommand = ({ addOne, removeOne, updateOne, setOrder }, events, command) => {
    if (command.type === 'add') {
        command.elements.forEach(addOne);
        events.add.emit(command.elements);
    }
    if (command.type === 'remove') {
        const ids = command.elements.map(el => el.id);
        ids.forEach(removeOne);
        events.remove.emit(ids);
    }
    if (command.type === 'update') {
        const values = command.elements.map(el => el.value);
        values.forEach(updateOne);
        events.update.emit(values);
    }
    if (command.type === 'order') {
        setOrder(command.after);
        events.setOrder.emit(command.after);
    }
};

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollection = void 0;
const tree_node_1 = require("@mojule/tree-node");
const util_1 = require("../util");
const commands_1 = require("../commands");
const events_1 = require("../events");
const tasks_1 = require("./tasks");
const commands_2 = require("./commands");
const order_1 = require("./order");
exports.createCollection = () => {
    const { root, elMap, commands, events, on, tasks, orderActions, reorder } = initCollection();
    const add = (elements) => {
        elements.forEach(tasks.addOne);
        commands.add({ type: 'add', elements });
        events.add.emit(elements);
    };
    const remove = (ids) => {
        const before = root.childNodes.map(n => n.value.id);
        const elements = ids.map(tasks.removeOne);
        commands.add({ type: 'remove', before, elements });
        events.remove.emit(ids);
    };
    const update = (elements) => {
        const updateElements = elements.map(tasks.updateOne);
        commands.add({ type: 'update', elements: updateElements });
        events.update.emit(elements);
    };
    const toStart = reorder(orderActions.toStart);
    const toEnd = reorder(orderActions.toEnd);
    const forward = reorder(orderActions.forward);
    const back = reorder(orderActions.back);
    const has = (id) => elMap.has(id);
    const get = (id) => util_1.strictMapGet(elMap, id).value;
    const toArray = () => root.childNodes.map(n => n.value);
    const undo = () => {
        const command = commands.nextUndo();
        if (command === undefined)
            return false;
        commands_2.undoCommand(tasks, events, command);
        return true;
    };
    const redo = () => {
        const command = commands.nextRedo();
        if (command === undefined)
            return false;
        commands_2.redoCommand(tasks, events, command);
        return true;
    };
    const collection = {
        add, remove, update, toStart, toEnd, forward, back, has, get, toArray,
        undo, redo, on
    };
    return collection;
};
const initCollection = () => {
    const root = tree_node_1.createNode({ id: 'root' });
    const elMap = new Map();
    const commands = commands_1.createCommands();
    const events = {
        add: events_1.createEmitter(),
        remove: events_1.createEmitter(),
        update: events_1.createEmitter(),
        setOrder: events_1.createEmitter()
    };
    const on = {
        add: events.add.on,
        remove: events.remove.on,
        update: events.update.on,
        setOrder: events.setOrder.on
    };
    const tasks = tasks_1.createTasks(elMap, root);
    const orderActions = order_1.createOrderActions(elMap, root);
    const reorder = createReorder(events, commands, root);
    return { root, elMap, commands, events, on, tasks, orderActions, reorder };
};
const createReorder = (events, commands, root) => {
    const reorder = (action) => {
        const handleCommandAndEvents = (ids) => {
            const before = root.childNodes.map(n => n.value.id);
            action(ids);
            const after = root.childNodes.map(n => n.value.id);
            commands.add({ type: 'order', before, after });
            events.setOrder.emit(after);
        };
        return handleCommandAndEvents;
    };
    return reorder;
};

},{"../commands":27,"../events":36,"../util":50,"./commands":23,"./order":25,"./tasks":26,"@mojule/tree-node":53}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderActions = void 0;
const util_1 = require("../util");
exports.createOrderActions = (elMap, root) => {
    const toStart = (ids) => {
        sortIds(elMap, ids).reverse().forEach(id => {
            const existing = util_1.strictMapGet(elMap, id);
            root.prependChild(existing);
        });
    };
    const toEnd = (ids) => {
        sortIds(elMap, ids).forEach(id => {
            const existing = util_1.strictMapGet(elMap, id);
            root.appendChild(existing);
        });
    };
    const forward = (ids) => {
        sortIds(elMap, ids).forEach(id => {
            const existing = util_1.strictMapGet(elMap, id);
            if (existing.nextSibling) {
                root.insertAfter(existing, existing.nextSibling);
            }
        });
    };
    const back = (ids) => {
        sortIds(elMap, ids).reverse().forEach(id => {
            const existing = util_1.strictMapGet(elMap, id);
            if (existing.previousSibling) {
                root.insertBefore(existing, existing.previousSibling);
            }
        });
    };
    return { toStart, toEnd, forward, back };
};
const sortIds = (elMap, ids) => ids.sort((a, b) => {
    const nodeA = util_1.strictMapGet(elMap, a);
    const nodeB = util_1.strictMapGet(elMap, b);
    return nodeA.index - nodeB.index;
});

},{"../util":50}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTasks = void 0;
const tree_node_1 = require("@mojule/tree-node");
const util_1 = require("../util");
// tasks do work and return info needed to create a command for undo/redo
exports.createTasks = (elMap, root) => {
    const addOne = (element) => {
        util_1.assertUnique(elMap, element.id);
        const node = tree_node_1.createNode(element);
        root.appendChild(node);
        elMap.set(element.id, node);
        return element;
    };
    const removeOne = (id) => {
        const node = util_1.strictMapGet(elMap, id);
        node.remove();
        elMap.delete(id);
        return node.value;
    };
    const updateOne = (element) => {
        const node = util_1.strictMapGet(elMap, element.id);
        const prev = node.value;
        node.value = element;
        return { prev, value: element };
    };
    const setOrder = (ids) => {
        const before = root.childNodes.map(n => n.value.id);
        if (ids.length !== before.length)
            throw Error(`Expected ${before.length} ids`);
        ids.forEach(id => {
            const existing = util_1.strictMapGet(elMap, id);
            root.appendChild(existing);
        });
        return { type: 'order', before, after: ids };
    };
    return { addOne, removeOne, updateOne, setOrder };
};

},{"../util":50,"@mojule/tree-node":53}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommands = void 0;
exports.createCommands = () => {
    const commands = {
        list: [],
        nextIndex: 0
    };
    const add = (command) => addCommand(commands, command);
    const nextUndo = () => nextUndoCommand(commands);
    const nextRedo = () => nextRedoCommand(commands);
    return { add, nextUndo, nextRedo };
};
const addCommand = (commands, command) => {
    const { nextIndex } = commands;
    commands.list = [...commands.list.slice(0, nextIndex), command];
    commands.nextIndex = commands.list.length;
};
const nextUndoCommand = (commands) => {
    const { list } = commands;
    if (list.length === 0 || commands.nextIndex === 0)
        return;
    const command = list[commands.nextIndex - 1];
    commands.nextIndex--;
    return command;
};
const nextRedoCommand = (commands) => {
    const { list, nextIndex } = commands;
    if (list.length === 0 || nextIndex >= list.length)
        return;
    const command = list[commands.nextIndex];
    commands.nextIndex++;
    return command;
};

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgNs = void 0;
exports.svgNs = 'http://www.w3.org/2000/svg';

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefsManager = void 0;
const s_1 = require("./s");
const util_1 = require("./util");
const patternUnits = 'userSpaceOnUse';
exports.createDefsManager = (svgEl) => {
    const defsEl = s_1.defs();
    svgEl.append(defsEl);
    const canvases = new Map();
    const setPattern = (id, canvas) => {
        if (canvases.has(id)) {
            const pattern = util_1.strictSelect(`#${id}`, defsEl);
            pattern.remove();
        }
        const { width, height } = canvas;
        const dataUrl = canvas.toDataURL();
        const imageEl = s_1.image({ href: `${dataUrl}`, x: 0, y: 0, width, height });
        imageEl.style.imageRendering = 'crisp-edges';
        const patternEl = s_1.pattern({ id, patternUnits, width, height }, imageEl);
        defsEl.append(patternEl);
        canvases.set(id, canvas);
    };
    const get = (id) => canvases.get(id);
    const getNames = () => [...canvases.keys()];
    const manager = { getNames, setPattern, get };
    return manager;
};

},{"./s":33,"./util":34}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRectElRect = exports.getRectElRect = exports.setViewBox = exports.getViewBoxRect = exports.transformToSvg = void 0;
const util_1 = require("./util");
exports.transformToSvg = ({ x, y, scale }) => `translate(${x} ${y}) scale(${scale})`;
exports.getViewBoxRect = (svg) => svg.viewBox.baseVal;
exports.setViewBox = (svg, { x, y, width, height }) => {
    util_1.attr(svg, { viewBox: [x, y, width, height].join(' ') });
};
exports.getRectElRect = (rectEl) => {
    const { x: ex, y: ey, width: ew, height: eh } = rectEl;
    const x = ex.baseVal.value;
    const y = ey.baseVal.value;
    const width = ew.baseVal.value;
    const height = eh.baseVal.value;
    const rect = { x, y, width, height };
    return rect;
};
exports.setRectElRect = (rectEl, rect) => {
    const initialRect = exports.getRectElRect(rectEl);
    const { x, y, width, height } = Object.assign({}, initialRect, rect);
    rectEl.x.baseVal.value = x;
    rectEl.y.baseVal.value = y;
    rectEl.width.baseVal.value = width;
    rectEl.height.baseVal.value = height;
};

},{"./util":34}],31:[function(require,module,exports){
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

},{"./predicates":32,"./util":34}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSVGElement = exports.isElement = exports.isNode = void 0;
const consts_1 = require("./consts");
exports.isNode = (value) => value && typeof value['nodeType'] === 'number';
exports.isElement = (value) => value && value['nodeType'] === 1;
exports.isSVGElement = (value) => exports.isElement(value) && value.namespaceURI === consts_1.svgNs;

},{"./consts":28}],33:[function(require,module,exports){
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

},{"./consts":28,"./predicates":32,"./util":34}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDragEmitter = void 0;
const _1 = require(".");
const mouse_buttons_1 = require("../mouse-buttons");
const pointer_emitter_1 = require("./pointer-emitter");
exports.createDragEmitter = (target, options = {}) => {
    const emitter = pointer_emitter_1.createPointerEmitter(target, options);
    let dragLine = null;
    const start = _1.createEmitter();
    const dragging = _1.createEmitter();
    const end = _1.createEmitter();
    const { transformPoint = (p) => p } = options;
    emitter.up.on(() => {
        if (dragLine === null)
            return;
        end.emit(dragLine);
        dragLine = null;
    });
    emitter.move.on(({ position, isDragging }) => {
        if (!isDragging)
            return;
        // only drag with main/left mouse button
        if (!mouse_buttons_1.mouseButtons.main) {
            return;
        }
        const { x, y } = transformPoint(position);
        if (dragLine === null) {
            dragLine = { x1: x, y1: y, x2: x, y2: y };
            start.emit(dragLine);
        }
        dragLine.x2 = x;
        dragLine.y2 = y;
        dragging.emit(dragLine);
    });
    return { start, dragging, end };
};

},{".":36,"../mouse-buttons":47,"./pointer-emitter":37}],36:[function(require,module,exports){
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

},{}],37:[function(require,module,exports){
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
        if (isDragging || event.isInside) {
            move.emit(event);
        }
    };
    const enable = () => {
        if (isAttached)
            return;
        target.addEventListener('mousedown', downListener, { passive: true });
        window.addEventListener('mouseup', upListener, { passive: true });
        window.addEventListener('mousemove', moveListener, { passive: true });
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
        const { button } = mouseEvent;
        const bounds = target.getBoundingClientRect();
        const position = getPosition(mouseEvent, bounds);
        const isInside = rect_1.rectContainsPoint(bounds, position);
        const event = { position, isDragging, isInside, button };
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

},{".":36,"../geometry/line":38,"../geometry/rect":43}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distance = exports.snapLineToGrid = exports.lineToArgs = exports.argsToLine = exports.getStart = exports.normalizeLine = exports.lineToVector = void 0;
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
exports.getStart = ({ x1, y1 }) => ({ x: x1, y: y1 });
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

},{"./number":39}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapToGrid = void 0;
exports.snapToGrid = (value, grid) => Math.floor(value / grid) * grid;

},{}],40:[function(require,module,exports){
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

},{"./number":39}],41:[function(require,module,exports){
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

},{"./predicates":42}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYPosition = exports.isXPosition = void 0;
const types_1 = require("./types");
exports.isXPosition = (value) => types_1.xPositionNames.includes(value);
exports.isYPosition = (value) => types_1.yPositionNames.includes(value);

},{"./types":45}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapRect = exports.rectContainsPoint = exports.scaleRect = exports.translateRect = exports.integerRect = void 0;
const number_1 = require("./number");
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
exports.snapRect = ({ x, y, width, height }, snapSize) => {
    x = number_1.snapToGrid(x, snapSize.width);
    y = number_1.snapToGrid(y, snapSize.height);
    width = number_1.snapToGrid(width, snapSize.width);
    height = number_1.snapToGrid(height, snapSize.height);
    const rect = { x, y, width, height };
    return rect;
};

},{"./number":39,"./point":40}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateAndScalePoint = exports.transformRelativeTo = void 0;
const point_1 = require("./point");
exports.transformRelativeTo = (existing, newScale, origin) => {
    const { scale } = existing;
    let newPoint = point_1.translatePoint(existing, point_1.scalePoint(origin, -1));
    newPoint = point_1.scalePoint(newPoint, newScale / scale);
    newPoint = point_1.translatePoint(newPoint, origin);
    const transformed = Object.assign(newPoint, { scale: newScale });
    return transformed;
};
exports.translateAndScalePoint = ({ x, y }, { x: tx, y: ty, scale }) => {
    x -= tx;
    y -= ty;
    x /= scale;
    y /= scale;
    return { x, y };
};

},{"./point":40}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = void 0;
exports.keys = {};
document.addEventListener('keydown', e => {
    exports.keys[e.key] = true;
});
document.addEventListener('keyup', e => {
    exports.keys[e.key] = false;
});

},{}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mouseButtons = void 0;
exports.mouseButtons = {
    main: false,
    secondary: false
};
document.addEventListener('mousedown', e => {
    if (e.button === 0)
        exports.mouseButtons.main = true;
    if (e.button === 2)
        exports.mouseButtons.secondary = true;
});
document.addEventListener('mouseup', e => {
    if (e.button === 0)
        exports.mouseButtons.main = false;
    if (e.button === 2)
        exports.mouseButtons.secondary = false;
});

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSelector = void 0;
const events_1 = require("../events");
const util_1 = require("../util");
exports.createSelector = () => {
    const set = new Set();
    const selectEmitter = events_1.createEmitter();
    const actions = {
        add: values => {
            values.forEach(v => set.add(v));
            selectEmitter.emit([...set]);
        },
        remove: values => {
            values.forEach(v => set.delete(v));
            selectEmitter.emit([...set]);
        },
        toggle: values => {
            values.forEach(v => {
                if (set.has(v)) {
                    set.delete(v);
                }
                else {
                    set.add(v);
                }
            });
            selectEmitter.emit([...set]);
        },
        clear: () => {
            set.clear();
            selectEmitter.emit([]);
        },
        get: () => util_1.clone([...set]),
        any: () => set.size > 0
    };
    const { on } = selectEmitter;
    return { actions, on };
};

},{"../events":36,"../util":50}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pipeStatePartial = exports.pipeState = exports.createEvents = exports.createEventedState = exports.createMappedState = exports.createState = void 0;
const events_1 = require("../events");
const util_1 = require("../util");
exports.createState = (keys) => {
    const stateValues = {};
    const get = util_1.typedReducer(keys, key => () => util_1.clone(util_1.strictValue(stateValues, key)));
    const set = util_1.typedReducer(keys, key => value => { stateValues[key] = util_1.clone(value); });
    return { get, set };
};
exports.createMappedState = (state, mapper) => {
    const { get, set: originalSet } = state;
    const keys = util_1.getKeys(originalSet);
    const set = util_1.typedReducer(keys, key => value => {
        const map = mapper[key];
        if (map !== undefined)
            value = map(value);
        originalSet[key](value);
    });
    return { get, set };
};
exports.createEventedState = (state, events = exports.createEvents(util_1.getKeys(state.set))) => {
    const { get, set: originalSet } = state;
    const keys = util_1.getKeys(originalSet);
    const set = util_1.typedReducer(keys, key => value => {
        originalSet[key](value);
        events[key].emit(get[key]());
    });
    const on = util_1.typedReducer(keys, key => listener => events[key].on(listener));
    return { get, set, on };
};
exports.createEvents = (keys) => util_1.typedReducer(keys, () => events_1.createEmitter());
exports.pipeState = (sender, receiver) => {
    const keys = util_1.getKeys(sender);
    keys.forEach(key => sender[key](receiver[key]));
};
exports.pipeStatePartial = (sender, receiver) => {
    const keys = util_1.getKeys(sender);
    keys.forEach(key => {
        const send = sender[key];
        const receive = receiver[key];
        if (receive === undefined)
            return;
        send(receive);
    });
};

},{"../events":36,"../util":50}],50:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictMapGet = exports.assertUnique = exports.typedReducer = exports.getKeys = exports.strictValue = exports.clone = exports.createSequence = exports.randomInt = exports.randomChar = exports.randomId = void 0;
exports.randomId = () => exports.createSequence(16, exports.randomChar).join('');
exports.randomChar = () => String.fromCharCode(exports.randomInt(26) + 97);
exports.randomInt = (exclMax) => Math.floor(Math.random() * exclMax);
exports.createSequence = (length, cb) => Array.from({ length }, (_v, index) => cb(index));
exports.clone = (value) => JSON.parse(JSON.stringify(value));
exports.strictValue = (record, key) => {
    const value = record[key];
    if (value === undefined)
        throw Error(`Expected ${key}`);
    return value;
};
exports.getKeys = (value) => Object.keys(value);
exports.typedReducer = (keys, reduce) => keys.reduce((target, key) => {
    target[key] = reduce(key);
    return target;
}, {});
exports.assertUnique = (map, key) => {
    if (map.has(key))
        throw Error(`Duplicate key ${key}`);
};
exports.strictMapGet = (map, key) => {
    const existing = map.get(key);
    if (existing === undefined)
        throw Error(`Expected key ${key}`);
    return existing;
};

},{}],51:[function(require,module,exports){
"use strict";
const is_1 = require("./is");
/*
  We add the custom predicates twice - first time, so that their key order is
  retained, then we add the defaults, then we add the custom predicates again
  in case any of them are supposed to override a default predicate
*/
const extendDefaults = (predicates) => Object.assign({}, predicates, is_1.is, predicates);
const Utils = (predicates) => {
    const keys = Object.keys(predicates);
    const isType = (subject, typename) => predicates[typename] && predicates[typename](subject);
    const isOnly = (subject, typename) => isType(subject, typename) && allOf(subject).length === 1;
    const some = (subject, ...typenames) => typenames.some(typename => isType(subject, typename));
    const every = (subject, ...typenames) => typenames.every(typename => isType(subject, typename));
    const _of = (subject) => keys.find(key => isType(subject, key));
    const allOf = (subject) => keys.filter(key => isType(subject, key));
    const types = () => keys.slice();
    return { isType, isOnly, some, every, of: _of, allOf, types };
};
const utils = Utils(is_1.is);
const Is = { is: is_1.is, extendDefaults, utils, Utils };
module.exports = Is;

},{"./is":52}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmptyObject = (obj) => {
    for (const key in obj)
        return false;
    return true;
};
const isNumber = (subject) => typeof subject === 'number' && isFinite(subject);
const isInteger = (subject) => Number.isInteger(subject);
const isString = (subject) => typeof subject === 'string';
const isBoolean = (subject) => typeof subject === 'boolean';
const isArray = (subject) => Array.isArray(subject);
const isNull = (subject) => subject === null;
const isUndefined = (subject) => subject === undefined;
const isFunction = (subject) => typeof subject === 'function';
// I think you can exclude array, null etc with Diff<T, U> in TS 2.8, look into
const isObject = (subject) => typeof subject === 'object' && !isNull(subject) && !isArray(subject);
const isEmpty = (subject) => isObject(subject) && isEmptyObject(subject);
exports.is = {
    number: isNumber,
    integer: isInteger,
    string: isString,
    boolean: isBoolean,
    array: isArray,
    null: isNull,
    undefined: isUndefined,
    function: isFunction,
    object: isObject,
    empty: isEmpty
};

},{}],53:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = require("@mojule/is");
const SymbolTree = require("symbol-tree");
exports.valueSymbol = Symbol('Mojule node value');
exports.apiSymbol = Symbol('Mojule node API');
const tree = new SymbolTree('Mojule node');
const toApi = nodeValue => nodeValue[exports.apiSymbol];
exports.isTreeNode = (value) => value && value[exports.valueSymbol];
exports.createNode = (value, options = {}) => {
    const { extend } = options;
    const nodeValue = { value };
    tree.initialize(nodeValue);
    const ensureParent = child => {
        const parent = tree.parent(child[exports.valueSymbol]);
        if (parent !== nodeValue)
            throw Error('Not a child of this node');
    };
    const node = {
        get value() {
            return nodeValue.value;
        },
        set value(newValue) {
            nodeValue.value = newValue;
        },
        get firstChild() {
            if (!tree.hasChildren(nodeValue))
                return null;
            return tree.firstChild(nodeValue)[exports.apiSymbol];
        },
        get lastChild() {
            if (!tree.hasChildren(nodeValue))
                return null;
            return tree.lastChild(nodeValue)[exports.apiSymbol];
        },
        get previousSibling() {
            const previous = tree.previousSibling(nodeValue);
            if (!previous)
                return null;
            return previous[exports.apiSymbol];
        },
        get nextSibling() {
            const next = tree.nextSibling(nodeValue);
            if (!next)
                return null;
            return next[exports.apiSymbol];
        },
        get parentNode() {
            const parent = tree.parent(nodeValue);
            if (!parent)
                return null;
            return parent[exports.apiSymbol];
        },
        get childNodes() {
            return tree.childrenToArray(nodeValue).map(toApi);
        },
        get ancestorNodes() {
            return tree.ancestorsToArray(nodeValue).map(toApi);
        },
        get index() {
            return tree.index(nodeValue);
        },
        hasChildNodes: () => tree.hasChildren(nodeValue),
        remove: () => toApi(tree.remove(nodeValue)),
        removeChild: child => {
            ensureParent(child);
            return toApi(tree.remove(child[exports.valueSymbol]));
        },
        insertBefore: (newNode, referenceNode) => {
            ensureParent(referenceNode);
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.insertBefore(referenceNode[exports.valueSymbol], newNode[exports.valueSymbol]));
        },
        insertAfter: (newNode, referenceNode) => {
            ensureParent(referenceNode);
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.insertAfter(referenceNode[exports.valueSymbol], newNode[exports.valueSymbol]));
        },
        prependChild: newNode => {
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.prependChild(nodeValue, newNode[exports.valueSymbol]));
        },
        appendChild: newNode => {
            tree.remove(newNode[exports.valueSymbol]);
            return toApi(tree.appendChild(nodeValue, newNode[exports.valueSymbol]));
        }
    };
    node[exports.valueSymbol] = nodeValue;
    nodeValue[exports.apiSymbol] = node;
    if (is_1.is.function(extend))
        extend(node, nodeValue, tree, exports.valueSymbol, exports.apiSymbol);
    return node;
};

},{"@mojule/is":51,"symbol-tree":58}],54:[function(require,module,exports){
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

},{}],55:[function(require,module,exports){
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

},{"./fitter":54,"./predicates":56,"./transform-fitted-point":57}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
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

},{"./fitter":54}],58:[function(require,module,exports){
'use strict';

/**
 * @module symbol-tree
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

const SymbolTreeNode = require('./SymbolTreeNode');
const TreePosition = require('./TreePosition');
const TreeIterator = require('./TreeIterator');

function returnTrue() {
        return true;
}

function reverseArrayIndex(array, reverseIndex) {
        return array[array.length - 1 - reverseIndex]; // no need to check `index >= 0`
}

class SymbolTree {

        /**
         * @constructor
         * @alias module:symbol-tree
         * @param {string} [description='SymbolTree data'] Description used for the Symbol
         */
        constructor(description) {
                this.symbol = Symbol(description || 'SymbolTree data');
        }

        /**
         * You can use this function to (optionally) initialize an object right after its creation,
         * to take advantage of V8's fast properties. Also useful if you would like to
         * freeze your object.
         *
         * `O(1)`
         *
         * @method
         * @alias module:symbol-tree#initialize
         * @param {Object} object
         * @return {Object} object
         */
        initialize(object) {
                this._node(object);

                return object;
        }

        _node(object) {
                if (!object) {
                        return null;
                }

                const node = object[this.symbol];

                if (node) {
                        return node;
                }

                return (object[this.symbol] = new SymbolTreeNode());
        }

        /**
         * Returns `true` if the object has any children. Otherwise it returns `false`.
         *
         * * `O(1)`
         *
         * @method hasChildren
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Boolean}
         */
        hasChildren(object) {
                return this._node(object).hasChildren;
        }

        /**
         * Returns the first child of the given object.
         *
         * * `O(1)`
         *
         * @method firstChild
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object}
         */
        firstChild(object) {
                return this._node(object).firstChild;
        }

        /**
         * Returns the last child of the given object.
         *
         * * `O(1)`
         *
         * @method lastChild
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object}
         */
        lastChild(object) {
                return this._node(object).lastChild;
        }

        /**
         * Returns the previous sibling of the given object.
         *
         * * `O(1)`
         *
         * @method previousSibling
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object}
         */
        previousSibling(object) {
                return this._node(object).previousSibling;
        }

        /**
         * Returns the next sibling of the given object.
         *
         * * `O(1)`
         *
         * @method nextSibling
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object}
         */
        nextSibling(object) {
                return this._node(object).nextSibling;
        }

        /**
         * Return the parent of the given object.
         *
         * * `O(1)`
         *
         * @method parent
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object}
         */
        parent(object) {
                return this._node(object).parent;
        }

        /**
         * Find the inclusive descendant that is last in tree order of the given object.
         *
         * * `O(n)` (worst case) where `n` is the depth of the subtree of `object`
         *
         * @method lastInclusiveDescendant
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object}
         */
        lastInclusiveDescendant(object) {
                let lastChild;
                let current = object;

                while ((lastChild = this._node(current).lastChild)) {
                        current = lastChild;
                }

                return current;
        }

        /**
         * Find the preceding object (A) of the given object (B).
         * An object A is preceding an object B if A and B are in the same tree
         * and A comes before B in tree order.
         *
         * * `O(n)` (worst case)
         * * `O(1)` (amortized when walking the entire tree)
         *
         * @method preceding
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @param {Object} [options]
         * @param {Object} [options.root] If set, `root` must be an inclusive ancestor
         *        of the return value (or else null is returned). This check _assumes_
         *        that `root` is also an inclusive ancestor of the given `object`
         * @return {?Object}
         */
        preceding(object, options) {
                const treeRoot = options && options.root;

                if (object === treeRoot) {
                        return null;
                }

                const previousSibling = this._node(object).previousSibling;

                if (previousSibling) {
                        return this.lastInclusiveDescendant(previousSibling);
                }

                // if there is no previous sibling return the parent (might be null)
                return this._node(object).parent;
        }

        /**
         * Find the following object (A) of the given object (B).
         * An object A is following an object B if A and B are in the same tree
         * and A comes after B in tree order.
         *
         * * `O(n)` (worst case) where `n` is the amount of objects in the entire tree
         * * `O(1)` (amortized when walking the entire tree)
         *
         * @method following
         * @memberOf module:symbol-tree#
         * @param {!Object} object
         * @param {Object} [options]
         * @param {Object} [options.root] If set, `root` must be an inclusive ancestor
         *        of the return value (or else null is returned). This check _assumes_
         *        that `root` is also an inclusive ancestor of the given `object`
         * @param {Boolean} [options.skipChildren=false] If set, ignore the children of `object`
         * @return {?Object}
         */
        following(object, options) {
                const treeRoot = options && options.root;
                const skipChildren = options && options.skipChildren;

                const firstChild = !skipChildren && this._node(object).firstChild;

                if (firstChild) {
                        return firstChild;
                }

                let current = object;

                do {
                        if (current === treeRoot) {
                                return null;
                        }

                        const nextSibling = this._node(current).nextSibling;

                        if (nextSibling) {
                                return nextSibling;
                        }

                        current = this._node(current).parent;
                } while (current);

                return null;
        }

        /**
         * Append all children of the given object to an array.
         *
         * * `O(n)` where `n` is the amount of children of the given `parent`
         *
         * @method childrenToArray
         * @memberOf module:symbol-tree#
         * @param {Object} parent
         * @param {Object} [options]
         * @param {Object[]} [options.array=[]]
         * @param {Function} [options.filter] Function to test each object before it is added to the array.
         *                            Invoked with arguments (object). Should return `true` if an object
         *                            is to be included.
         * @param {*} [options.thisArg] Value to use as `this` when executing `filter`.
         * @return {Object[]}
         */
        childrenToArray(parent, options) {
                const array   = (options && options.array) || [];
                const filter  = (options && options.filter) || returnTrue;
                const thisArg = (options && options.thisArg) || undefined;

                const parentNode = this._node(parent);
                let object = parentNode.firstChild;
                let index = 0;

                while (object) {
                        const node = this._node(object);
                        node.setCachedIndex(parentNode, index);

                        if (filter.call(thisArg, object)) {
                                array.push(object);
                        }

                        object = node.nextSibling;
                        ++index;
                }

                return array;
        }

        /**
         * Append all inclusive ancestors of the given object to an array.
         *
         * * `O(n)` where `n` is the amount of ancestors of the given `object`
         *
         * @method ancestorsToArray
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @param {Object} [options]
         * @param {Object[]} [options.array=[]]
         * @param {Function} [options.filter] Function to test each object before it is added to the array.
         *                            Invoked with arguments (object). Should return `true` if an object
         *                            is to be included.
         * @param {*} [options.thisArg] Value to use as `this` when executing `filter`.
         * @return {Object[]}
         */
        ancestorsToArray(object, options) {
                const array   = (options && options.array) || [];
                const filter  = (options && options.filter) || returnTrue;
                const thisArg = (options && options.thisArg) || undefined;

                let ancestor = object;

                while (ancestor) {
                        if (filter.call(thisArg, ancestor)) {
                                array.push(ancestor);
                        }
                        ancestor = this._node(ancestor).parent;
                }

                return array;
        }

        /**
         * Append all descendants of the given object to an array (in tree order).
         *
         * * `O(n)` where `n` is the amount of objects in the sub-tree of the given `object`
         *
         * @method treeToArray
         * @memberOf module:symbol-tree#
         * @param {Object} root
         * @param {Object} [options]
         * @param {Object[]} [options.array=[]]
         * @param {Function} [options.filter] Function to test each object before it is added to the array.
         *                            Invoked with arguments (object). Should return `true` if an object
         *                            is to be included.
         * @param {*} [options.thisArg] Value to use as `this` when executing `filter`.
         * @return {Object[]}
         */
        treeToArray(root, options) {
                const array   = (options && options.array) || [];
                const filter  = (options && options.filter) || returnTrue;
                const thisArg = (options && options.thisArg) || undefined;

                let object = root;

                while (object) {
                        if (filter.call(thisArg, object)) {
                                array.push(object);
                        }
                        object = this.following(object, {root: root});
                }

                return array;
        }

        /**
         * Iterate over all children of the given object
         *
         * * `O(1)` for a single iteration
         *
         * @method childrenIterator
         * @memberOf module:symbol-tree#
         * @param {Object} parent
         * @param {Object} [options]
         * @param {Boolean} [options.reverse=false]
         * @return {Object} An iterable iterator (ES6)
         */
        childrenIterator(parent, options) {
                const reverse = options && options.reverse;
                const parentNode = this._node(parent);

                return new TreeIterator(
                        this,
                        parent,
                        reverse ? parentNode.lastChild : parentNode.firstChild,
                        reverse ? TreeIterator.PREV : TreeIterator.NEXT
                );
        }

        /**
         * Iterate over all the previous siblings of the given object. (in reverse tree order)
         *
         * * `O(1)` for a single iteration
         *
         * @method previousSiblingsIterator
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object} An iterable iterator (ES6)
         */
        previousSiblingsIterator(object) {
                return new TreeIterator(
                        this,
                        object,
                        this._node(object).previousSibling,
                        TreeIterator.PREV
                );
        }

        /**
         * Iterate over all the next siblings of the given object. (in tree order)
         *
         * * `O(1)` for a single iteration
         *
         * @method nextSiblingsIterator
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object} An iterable iterator (ES6)
         */
        nextSiblingsIterator(object) {
                return new TreeIterator(
                        this,
                        object,
                        this._node(object).nextSibling,
                        TreeIterator.NEXT
                );
        }

        /**
         * Iterate over all inclusive ancestors of the given object
         *
         * * `O(1)` for a single iteration
         *
         * @method ancestorsIterator
         * @memberOf module:symbol-tree#
         * @param {Object} object
         * @return {Object} An iterable iterator (ES6)
         */
        ancestorsIterator(object) {
                return new TreeIterator(
                        this,
                        object,
                        object,
                        TreeIterator.PARENT
                );
        }

        /**
         * Iterate over all descendants of the given object (in tree order).
         *
         * Where `n` is the amount of objects in the sub-tree of the given `root`:
         *
         * * `O(n)` (worst case for a single iteration)
         * * `O(n)` (amortized, when completing the iterator)
         *
         * @method treeIterator
         * @memberOf module:symbol-tree#
         * @param {Object} root
         * @param {Object} options
         * @param {Boolean} [options.reverse=false]
         * @return {Object} An iterable iterator (ES6)
         */
        treeIterator(root, options) {
                const reverse = options && options.reverse;

                return new TreeIterator(
                        this,
                        root,
                        reverse ? this.lastInclusiveDescendant(root) : root,
                        reverse ? TreeIterator.PRECEDING : TreeIterator.FOLLOWING
                );
        }

        /**
         * Find the index of the given object (the number of preceding siblings).
         *
         * * `O(n)` where `n` is the amount of preceding siblings
         * * `O(1)` (amortized, if the tree is not modified)
         *
         * @method index
         * @memberOf module:symbol-tree#
         * @param {Object} child
         * @return {Number} The number of preceding siblings, or -1 if the object has no parent
         */
        index(child) {
                const childNode = this._node(child);
                const parentNode = this._node(childNode.parent);

                if (!parentNode) {
                        // In principal, you could also find out the number of preceding siblings
                        // for objects that do not have a parent. This method limits itself only to
                        // objects that have a parent because that lets us optimize more.
                        return -1;
                }

                let currentIndex = childNode.getCachedIndex(parentNode);

                if (currentIndex >= 0) {
                        return currentIndex;
                }

                currentIndex = 0;
                let object = parentNode.firstChild;

                if (parentNode.childIndexCachedUpTo) {
                        const cachedUpToNode = this._node(parentNode.childIndexCachedUpTo);
                        object = cachedUpToNode.nextSibling;
                        currentIndex = cachedUpToNode.getCachedIndex(parentNode) + 1;
                }

                while (object) {
                        const node = this._node(object);
                        node.setCachedIndex(parentNode, currentIndex);

                        if (object === child) {
                                break;
                        }

                        ++currentIndex;
                        object = node.nextSibling;
                }

                parentNode.childIndexCachedUpTo = child;

                return currentIndex;
        }

        /**
         * Calculate the number of children.
         *
         * * `O(n)` where `n` is the amount of children
         * * `O(1)` (amortized, if the tree is not modified)
         *
         * @method childrenCount
         * @memberOf module:symbol-tree#
         * @param {Object} parent
         * @return {Number}
         */
        childrenCount(parent) {
                const parentNode = this._node(parent);

                if (!parentNode.lastChild) {
                        return 0;
                }

                return this.index(parentNode.lastChild) + 1;
        }

        /**
         * Compare the position of an object relative to another object. A bit set is returned:
         *
         * <ul>
         *     <li>DISCONNECTED : 1</li>
         *     <li>PRECEDING : 2</li>
         *     <li>FOLLOWING : 4</li>
         *     <li>CONTAINS : 8</li>
         *     <li>CONTAINED_BY : 16</li>
         * </ul>
         *
         * The semantics are the same as compareDocumentPosition in DOM, with the exception that
         * DISCONNECTED never occurs with any other bit.
         *
         * where `n` and `m` are the amount of ancestors of `left` and `right`;
         * where `o` is the amount of children of the lowest common ancestor of `left` and `right`:
         *
         * * `O(n + m + o)` (worst case)
         * * `O(n + m)` (amortized, if the tree is not modified)
         *
         * @method compareTreePosition
         * @memberOf module:symbol-tree#
         * @param {Object} left
         * @param {Object} right
         * @return {Number}
         */
        compareTreePosition(left, right) {
                // In DOM terms:
                // left = reference / context object
                // right = other

                if (left === right) {
                        return 0;
                }

                /* jshint -W016 */

                const leftAncestors = []; { // inclusive
                        let leftAncestor = left;

                        while (leftAncestor) {
                                if (leftAncestor === right) {
                                        return TreePosition.CONTAINS | TreePosition.PRECEDING;
                                        // other is ancestor of reference
                                }

                                leftAncestors.push(leftAncestor);
                                leftAncestor = this.parent(leftAncestor);
                        }
                }


                const rightAncestors = []; {
                        let rightAncestor = right;

                        while (rightAncestor) {
                                if (rightAncestor === left) {
                                        return TreePosition.CONTAINED_BY | TreePosition.FOLLOWING;
                                }

                                rightAncestors.push(rightAncestor);
                                rightAncestor = this.parent(rightAncestor);
                        }
                }


                const root = reverseArrayIndex(leftAncestors, 0);

                if (!root || root !== reverseArrayIndex(rightAncestors, 0)) {
                        // note: unlike DOM, preceding / following is not set here
                        return TreePosition.DISCONNECTED;
                }

                // find the lowest common ancestor
                let commonAncestorIndex = 0;
                const ancestorsMinLength = Math.min(leftAncestors.length, rightAncestors.length);

                for (let i = 0; i < ancestorsMinLength; ++i) {
                        const leftAncestor  = reverseArrayIndex(leftAncestors, i);
                        const rightAncestor = reverseArrayIndex(rightAncestors, i);

                        if (leftAncestor !== rightAncestor) {
                                break;
                        }

                        commonAncestorIndex = i;
                }

                // indexes within the common ancestor
                const leftIndex  = this.index(reverseArrayIndex(leftAncestors, commonAncestorIndex + 1));
                const rightIndex = this.index(reverseArrayIndex(rightAncestors, commonAncestorIndex + 1));

                return rightIndex < leftIndex
                        ? TreePosition.PRECEDING
                        : TreePosition.FOLLOWING;
        }

        /**
         * Remove the object from this tree.
         * Has no effect if already removed.
         *
         * * `O(1)`
         *
         * @method remove
         * @memberOf module:symbol-tree#
         * @param {Object} removeObject
         * @return {Object} removeObject
         */
        remove(removeObject) {
                const removeNode = this._node(removeObject);
                const parentNode = this._node(removeNode.parent);
                const prevNode = this._node(removeNode.previousSibling);
                const nextNode = this._node(removeNode.nextSibling);

                if (parentNode) {
                        if (parentNode.firstChild === removeObject) {
                                parentNode.firstChild = removeNode.nextSibling;
                        }

                        if (parentNode.lastChild === removeObject) {
                                parentNode.lastChild = removeNode.previousSibling;
                        }
                }

                if (prevNode) {
                        prevNode.nextSibling = removeNode.nextSibling;
                }

                if (nextNode) {
                        nextNode.previousSibling = removeNode.previousSibling;
                }

                removeNode.parent = null;
                removeNode.previousSibling = null;
                removeNode.nextSibling = null;
                removeNode.cachedIndex = -1;
                removeNode.cachedIndexVersion = NaN;

                if (parentNode) {
                        parentNode.childrenChanged();
                }

                return removeObject;
        }

        /**
         * Insert the given object before the reference object.
         * `newObject` is now the previous sibling of `referenceObject`.
         *
         * * `O(1)`
         *
         * @method insertBefore
         * @memberOf module:symbol-tree#
         * @param {Object} referenceObject
         * @param {Object} newObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        insertBefore(referenceObject, newObject) {
                const referenceNode = this._node(referenceObject);
                const prevNode = this._node(referenceNode.previousSibling);
                const newNode = this._node(newObject);
                const parentNode = this._node(referenceNode.parent);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                newNode.parent = referenceNode.parent;
                newNode.previousSibling = referenceNode.previousSibling;
                newNode.nextSibling = referenceObject;
                referenceNode.previousSibling = newObject;

                if (prevNode) {
                        prevNode.nextSibling = newObject;
                }

                if (parentNode && parentNode.firstChild === referenceObject) {
                        parentNode.firstChild = newObject;
                }

                if (parentNode) {
                        parentNode.childrenChanged();
                }

                return newObject;
        }

        /**
         * Insert the given object after the reference object.
         * `newObject` is now the next sibling of `referenceObject`.
         *
         * * `O(1)`
         *
         * @method insertAfter
         * @memberOf module:symbol-tree#
         * @param {Object} referenceObject
         * @param {Object} newObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        insertAfter(referenceObject, newObject) {
                const referenceNode = this._node(referenceObject);
                const nextNode = this._node(referenceNode.nextSibling);
                const newNode = this._node(newObject);
                const parentNode = this._node(referenceNode.parent);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                newNode.parent = referenceNode.parent;
                newNode.previousSibling = referenceObject;
                newNode.nextSibling = referenceNode.nextSibling;
                referenceNode.nextSibling = newObject;

                if (nextNode) {
                        nextNode.previousSibling = newObject;
                }

                if (parentNode && parentNode.lastChild === referenceObject) {
                        parentNode.lastChild = newObject;
                }

                if (parentNode) {
                        parentNode.childrenChanged();
                }

                return newObject;
        }

        /**
         * Insert the given object as the first child of the given reference object.
         * `newObject` is now the first child of `referenceObject`.
         *
         * * `O(1)`
         *
         * @method prependChild
         * @memberOf module:symbol-tree#
         * @param {Object} referenceObject
         * @param {Object} newObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        prependChild(referenceObject, newObject) {
                const referenceNode = this._node(referenceObject);
                const newNode = this._node(newObject);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                if (referenceNode.hasChildren) {
                        this.insertBefore(referenceNode.firstChild, newObject);
                }
                else {
                        newNode.parent = referenceObject;
                        referenceNode.firstChild = newObject;
                        referenceNode.lastChild = newObject;
                        referenceNode.childrenChanged();
                }

                return newObject;
        }

        /**
         * Insert the given object as the last child of the given reference object.
         * `newObject` is now the last child of `referenceObject`.
         *
         * * `O(1)`
         *
         * @method appendChild
         * @memberOf module:symbol-tree#
         * @param {Object} referenceObject
         * @param {Object} newObject
         * @throws {Error} If the newObject is already present in this SymbolTree
         * @return {Object} newObject
         */
        appendChild(referenceObject, newObject) {
                const referenceNode = this._node(referenceObject);
                const newNode = this._node(newObject);

                if (newNode.isAttached) {
                        throw Error('Given object is already present in this SymbolTree, remove it first');
                }

                if (referenceNode.hasChildren) {
                        this.insertAfter(referenceNode.lastChild, newObject);
                }
                else {
                        newNode.parent = referenceObject;
                        referenceNode.firstChild = newObject;
                        referenceNode.lastChild = newObject;
                        referenceNode.childrenChanged();
                }

                return newObject;
        }
}

module.exports = SymbolTree;
SymbolTree.TreePosition = TreePosition;

},{"./SymbolTreeNode":59,"./TreeIterator":60,"./TreePosition":61}],59:[function(require,module,exports){
'use strict';

module.exports = class SymbolTreeNode {
        constructor() {
                this.parent = null;
                this.previousSibling = null;
                this.nextSibling = null;

                this.firstChild = null;
                this.lastChild = null;

                /** This value is incremented anytime a children is added or removed */
                this.childrenVersion = 0;
                /** The last child object which has a cached index */
                this.childIndexCachedUpTo = null;

                /** This value represents the cached node index, as long as
                 * cachedIndexVersion matches with the childrenVersion of the parent */
                this.cachedIndex = -1;
                this.cachedIndexVersion = NaN; // NaN is never equal to anything
        }

        get isAttached() {
                return Boolean(this.parent || this.previousSibling || this.nextSibling);
        }

        get hasChildren() {
                return Boolean(this.firstChild);
        }

        childrenChanged() {
                /* jshint -W016 */
                // integer wrap around
                this.childrenVersion = (this.childrenVersion + 1) & 0xFFFFFFFF;
                this.childIndexCachedUpTo = null;
        }

        getCachedIndex(parentNode) {
                // (assumes parentNode is actually the parent)
                if (this.cachedIndexVersion !== parentNode.childrenVersion) {
                        this.cachedIndexVersion = NaN;
                        // cachedIndex is no longer valid
                        return -1;
                }

                return this.cachedIndex; // -1 if not cached
        }

        setCachedIndex(parentNode, index) {
                // (assumes parentNode is actually the parent)
                this.cachedIndexVersion = parentNode.childrenVersion;
                this.cachedIndex = index;
        }
};

},{}],60:[function(require,module,exports){
'use strict';

const TREE = Symbol();
const ROOT = Symbol();
const NEXT = Symbol();
const ITERATE_FUNC = Symbol();

class TreeIterator {
        constructor(tree, root, firstResult, iterateFunction) {
                this[TREE] = tree;
                this[ROOT] = root;
                this[NEXT] = firstResult;
                this[ITERATE_FUNC] = iterateFunction;
        }

        next() {
                const tree = this[TREE];
                const iterateFunc = this[ITERATE_FUNC];
                const root = this[ROOT];

                if (!this[NEXT]) {
                        return {
                                done: true,
                                value: root,
                        };
                }

                const value = this[NEXT];

                if (iterateFunc === 1) {
                        this[NEXT] = tree._node(value).previousSibling;
                }
                else if (iterateFunc === 2) {
                        this[NEXT] = tree._node(value).nextSibling;
                }
                else if (iterateFunc === 3) {
                        this[NEXT] = tree._node(value).parent;
                }
                else if (iterateFunc === 4) {
                        this[NEXT] = tree.preceding(value, {root: root});
                }
                else /* if (iterateFunc === 5)*/ {
                        this[NEXT] = tree.following(value, {root: root});
                }

                return {
                        done: false,
                        value: value,
                };
        }
}

Object.defineProperty(TreeIterator.prototype, Symbol.iterator, {
        value: function() {
                return this;
        },
        writable: false,
});

TreeIterator.PREV = 1;
TreeIterator.NEXT = 2;
TreeIterator.PARENT = 3;
TreeIterator.PRECEDING = 4;
TreeIterator.FOLLOWING = 5;

Object.freeze(TreeIterator);
Object.freeze(TreeIterator.prototype);

module.exports = TreeIterator;

},{}],61:[function(require,module,exports){
'use strict';

/* eslint-disable sort-keys */
module.exports = Object.freeze({
        // same as DOM DOCUMENT_POSITION_
        DISCONNECTED: 1,
        PRECEDING: 2,
        FOLLOWING: 4,
        CONTAINS: 8,
        CONTAINED_BY: 16,
});

},{}]},{},[22]);
