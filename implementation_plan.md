# Sticky Notes Canvas Improvements (Revised)

This plan is updated to focus on **performance**, **zooming**, and **note linking**, while holding off on automatic grouping bubbles to avoid any performance throttling.

---

## User Review Required

> [!IMPORTANT]
> **Performance Guarantee**: By omitting the automatic grouping/clustering algorithms and hull-drawing math, the canvas will maintain a locked 60fps. Panning and dragging calculations are kept extremely simple.
> 
> **Visual Linking Approach**: 
> - We will automatically render curved connection lines (SVG paths) between notes on the canvas that have parent-child relationships (sub-pages) or wiki-links.
> - We will also add a simple "Connect to..." button in the card menu to let you manually link any two notes on the board, storing the custom connections in local storage.

---

## Proposed Changes

We will modify the CSS layouts and Javascript functionality within [FocusThinking.html](file:///Users/personal/Documents/WebApplications/Focused-Dashboard/FocusThinking/FocusThinking.html).

### 1. Canvas Zoom & Pan Core
#### [MODIFY] Stylesheets (~L13225-L13488)
- Update `#boardCanvas` and `#boardSurface` to support 3D hardware-accelerated transforms (`transform-origin: 0 0`, `will-change: transform`).
- Style the visual connection lines (SVG paths with soft colored strokes and arrowheads).
- Add CSS styling for a floating Zoom Control Widget in the bottom-left corner of the canvas (`+`, `-`, and `Reset` buttons).
- Style a slide-out Side Drawer on the right side of the canvas for the note editor.

#### [MODIFY] JS State & Event Listeners
- Add global canvas state:
  - `zoom`: scale factor (bounds: `0.2` to `2.5`, default `1.0`).
  - `customConnections`: array of manual links `{ fromId, toId }` stored in `localStorage`.
- Update `renderBoardCanvas` to apply `transform: translate3d(${panX}px, ${panY}px, 0) scale(${zoom})` on `#boardSurface`.
- Modify dragging coordinates to be zoom-aware:
  $$\text{dragCard.x} = \text{dragCard.x} + \frac{\Delta x}{\text{zoom}}$$
  $$\text{dragCard.y} = \text{dragCard.y} + \frac{\Delta y}{\text{zoom}}$$
  This ensures dragging speed matches the cursor movement at all zoom scales.

---

### 2. Interaction Enhancements

#### Zoom in and Out (Mouse Wheel, Trackpad Pinch, Controls)
- Add a mouse `wheel` listener to `#boardCanvas`. Zoom centers on the cursor position:
  $$\text{panX} = \text{mouseX} - (\text{mouseX} - \text{panX}) \times \frac{\text{newZoom}}{\text{oldZoom}}$$
  $$\text{panY} = \text{mouseY} - (\text{mouseY} - \text{panY}) \times \frac{\text{newZoom}}{\text{oldZoom}}$$
- Support trackpad pinch-to-zoom (using `ctrlKey` mouse wheel events).
- Implement a floating UI controller with Zoom In (`+`), Zoom Out (`-`), and Reset (`100%`) buttons.

#### Double-Click to Add Note ("Drop a note anywhere")
- Add a `dblclick` listener to `#boardCanvas` (filtering out clicks on cards or buttons).
- Spawn a new blank note exactly at the calculated canvas coordinates.

---

### 3. Note Linking & Visual Connections

#### Tapping Card to Open Note in Drawer
- Implement a slide-out Side Drawer (`#boardSideDrawer`) that overlays the right 40% of the screen.
- Clicking the "Open Note" button on a card slide-opens the drawer and loads the note block editor inside it. This allows you to edit notes while keeping the canvas spatial layout fully visible.

#### See Connections (Visual lines)
- Render an SVG overlay layer behind cards (`#boardConnectionsSvg`) that dynamically draws curved paths between:
  1. Parents and child sub-pages.
  2. Notes containing wiki-links to each other.
  3. Custom user-linked notes.
- Add a "Link Note" button to the selected card's bottom toolbar. Tapping it opens a quick dropdown to select another card on the board to draw a visual link line between them.

---

## Verification Plan

### Automated Verification
- Verify HTML/JS syntax:
  ```bash
  python3 validate_syntax.py
  ```
- Build thinking bundle:
  ```bash
  ./build_thinking_bundle.sh
  ```

### Manual Verification (User & Developer)
- **Zoom Verification**: Scroll wheel over the canvas. Check that zoom level transitions smoothly and stays centered on the cursor.
- **Drag at Zoom Verification**: Set zoom to `0.5x` and `2x`. Drag a card and verify it tracks the mouse cursor perfectly without drifting.
- **Double-Click Spawn Verification**: Double-click empty canvas space. Check if a new note is added at the double-click position.
- **Visual Connections Verification**: Link two notes. Verify that a curved line appears on the canvas connecting the cards.
- **Drawer Editor Verification**: Click "Open Note". Check if the block editor opens in a right-hand drawer and edits save in real time.
