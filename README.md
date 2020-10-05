# rect-editor

Drag and drop rectangle editor

## TODO

- Multi select 
  - hold shift to add to toggle selection of individual rects
  - drag to select all in drag area
- Use an action list to allow undo/redo stack - things that are actions:
  - creating a new rect
  - moving/editing/deleting rects
- If a rect selected, `Delete` key removes
- If a selected rect is dragged, it moves
- Selected rect should have resize handles, drag to resize
- If handle is dragged with `Shift` key down, rect maintains aspect ratio
- Selected rect should have a form to edit eg x, y, width, height
- If tap in draw mode, location is x,y - modal asks for width and height
- Way to change z-index of rects (bring forward, send to back etc)
- Create rects in directions other than top left -> bottom right
- width/height tooltip while creating/resizing
- dx/dy tooltip while dragging
- New mode, zoom
- New / save / load
- Icons for buttons etc
- Copy/paste