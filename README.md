# rect-editor

Drag and drop rectangle editor

## TODO

- Multi select 
  - hold `Shift` to add to toggle selection of individual rects
  - drag to select all in drag area
- If rect(s) selected, `Delete` key removes
  - need new action, deleteGroup
- If rect(s) selected, drag to move
  - need new action, editGroup
- Selected rect should have resize handles, drag to resize
  - Same for multiple selection?
  - If handle is dragged with `Shift` key down, rect maintains aspect ratio
- Selected rect should have a form to edit eg x, y, width, height
  - Disabled if multiselect?
- If tap in draw mode, location is x,y - modal asks for width and height
  - Maybe have drop down, allow placing more than 1 
    - If more than one, choose pattern, eg stack, column, row, grid
- Set cursor type (on mouse move? or CSS?)
- Arrange rect(s) (bring forward, send to back etc)
  - Should be undo/redoable - new action or make code more z index aware?
- Arrow keys with a selection should move rects
- Show width/height tooltip while creating/resizing
- Show dx/dy tooltip while dragging
- New mode, zoom
- Copy/cut/paste - on paste, action add, on cut action delete
- Undo/redo - when reinstating a rect(s), select it
- General tidy up, things are a bit of a mess!
- New project / save / load
- Right Click menu
- Double click to edit selection?
- Prefabs - basically, like copy/paste except they get saved
- Layers
- Groups - basically just saved selections?
- Align and distribute
- Icons for buttons etc
