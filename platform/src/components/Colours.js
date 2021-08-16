export const header_tabs = {
  main: "#0C79FA",
  A: "#0C79FA",
  B: "#0C79FA",
  C: "#0C79FA",
};

const grid = 5;

// for dark mode
export const bgcolors_dict = {
  original: "#DEB2F4",
  A: "#A4CDF0",
  B: "#A2DCE2",
  C: "#F9D3BC",
  trash: "#ccc5b4",
  add: "#ccc5b4",
};

// for light mode
// export const bgcolors_dict = {
//   original: "#ca76f5",
//   A: "#5ca1db",
//   B: "#56d3e3",
//   C: "#ffae7d",
//   trash: "#ccc5b4",
//   add: "#ccc5b4",
// };

const rowcolor = "#edf1f2";
export const hypotheses_dark_colour = "#92d5e6";
export const hypotheses_light_colour = "#e1edf0";

export function getListStyle(isDraggingOver, type) {
  const bgcolor = bgcolors_dict[type];
  return {
    background: isDraggingOver ? "#f5eef8" : bgcolor,
    padding: grid,
    minWidth: "250px",
    minHeight: "50px",
  };
}

export function getItemStyle(isDragging, draggableStyle) {
  return {
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : rowcolor,

    // styles we need to apply on draggables
    ...draggableStyle,
  };
}
