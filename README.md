# rect-editor

Browser based drag and drop rectangle editor

Intended as a base for building document editors operating on a fixed canvas
size

## TODO

Legend:
  [x] Done  [+] Partial / basic  [ ] Not started

UI / Interaction
  [x] Arrange rect(s) (bring forward/back) with undo/redo
  [x] Show dx/dy tooltip while dragging (Delta panel)
  [x] Show selection bounds and style swap
  [+] Set cursor type (resize & move states implemented; others todo)
  [ ] Selected rect form edit (x,y,width,height)
  [ ] Tap in draw mode opens size modal / multiple placement patterns
  [ ] Arrow keys in pan should move canvas
  [ ] Arrow keys move selected rect(s)
  [ ] Plus/minus/asterisk keys zoom in/out/reset
  [ ] Zoom mode (dedicated)
  [ ] Right click context menu
  [ ] Double click to edit selection
  [ ] Copy/cut/paste, prefabs
  [ ] Align and distribute
  [ ] Icons for buttons

State / Persistence
  [x] New / save / load (JSON)
  [x] Background image persist & fit
  [x] Visual grid vs snap grid decoupled
  [ ] Undo/redo restore selection (currently resets style; selection not restored)
  [ ] Layer groups (saved selections)

Modal System
  [+] Custom modal implementation
  [ ] Migrate to <dialog>

Keyboard
  [x] Ctrl+Z / Ctrl+Shift+Z undo/redo
  [ ] Arrow keys behaviors (pan / move)
  [ ] Zoom shortcuts

Quality / Polish
  [x] Smooth exponential wheel zoom
  [x] Correct zoom-to-fit centering & minScale clamp
  [x] Fixed pan drag scaling jump
  [x] Aspect ratio resize with Shift
  [ ] Dirty tracking of style changes (currently not tracked)
  [ ] Inertial panning / double-click zoom
  [ ] Debug overlay (bounds, center)

Potential Enhancements
  [ ] Align to selection edges
  [ ] Distribute spacing horizontally/vertically
  [ ] Snapshot diff tool for templates
  [ ] Export optimized/minified doc

