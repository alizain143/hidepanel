const Main = imports.ui.main;
const Panel = Main.panel;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const WindowManager = imports.ui.windowManager;

let panelVisibilitySignal;

function _updatePanelVisibility() {
  let windows = global.get_window_actors();
  let panelShouldHide = false;

  windows.forEach(function (window) {
    let metaWindow = window.meta_window;

    // Check if any window is near or overlapping the panel
    if (metaWindow.get_frame_rect().y <= Panel.height) {
      panelShouldHide = true;
    }
  });

  // Hide the panel if necessary
  if (panelShouldHide) {
    Panel.hide();
  } else {
    Panel.show();
  }
}

function enable() {
  // Listen for changes in the window layout
  panelVisibilitySignal = global.display.connect(
    "window-demands-attention",
    _updatePanelVisibility
  );
  // Run the check initially
  _updatePanelVisibility();
}

function disable() {
  if (panelVisibilitySignal) {
    global.display.disconnect(panelVisibilitySignal);
    panelVisibilitySignal = null;
  }
  Panel.show(); // Make sure the panel is shown when the extension is disabled
}
