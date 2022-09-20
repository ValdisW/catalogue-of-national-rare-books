import * as d3 from "d3";

export function Tooltip() {
  let frameOfReference,
    currentEvent,
    extent = new Array([
      [0, 0],
      [960, 500],
    ]),
    tips = new Array([]),
    tipNames = new Array([]),
    tipFormats = new Array([]),
    margin = new Array([10, 10]),
    padding = new Array([4, 4]),
    translation = new Array([0, 0]),
    // tooltipDims = new Array([0, 0]),
    fontSize = 12,
    dataProcess = function (e, d) {
      return d;
    };

  let tooltipGroup = d3.select(null),
    // tooltipRect = d3.select(null),
    tooltipText = d3.select(null);

  let tooltip = function (context) {
    tooltipGroup.remove();

    frameOfReference = context.node();
    console.log(frameOfReference);

    tooltipGroup = context
      .append("div")
      .style("position", "fixed")
      .style("text-align", "left")
      .style("background-color", "rgba(220, 220, 220, 0.8)")
      .style("padding", "5px")
      .classed("d3Tooltip", true)
      .style("display", "none");
    // .append("g")
    // .classed("d3Tooltip", true)
    // .style("display", "none");

    // tooltipRect = tooltipGroup
    //     .append("rect")
    //     .attr("width", 100)
    //     .attr("height", 100)
    //     .style("fill", "black")
    //     .style("fill-opacity", 0.7);

    tooltipText = tooltipGroup
      .append("text")
      .attr("id", "tooltip-text") // added
      .style("fill", "white")
      .style("font-size", fontSize);
  };

  function displayTooltip(e, d) {
    tooltipGroup.style("display", null).style("width", "auto");

    // tooltipText.selectAll("tspan").remove();

    // d = Data.get_book_info(d);
    d = dataProcess(e, d);
    // console.log("tooltip", d)

    tooltipText
      .attr("y", padding[1])
      .selectAll("span")
      .data(tips.filter((e) => e in d || ("data" in d && e in d.data)))
      .join("span")
      .attr("x", padding[0])
      .attr("dy", fontSize)
      .text(function (e, i) {
        let val;
        if (typeof d[e] == "undefined") {
          // check the 'data' property too, for voronoi mouseover events
          val = d.data[e];
        } else {
          val = d[e];
        }
        if (tipFormats[i]) {
          val = tipFormats[i](val);
        }

        return tipNames[i] + val;
      })
      .append("br");

    // updateTooltipDims();

    // if (tooltipDims[0] === padding[0] * 2 &&  tooltipDims[1] === padding[1] * 2) {
    //     tooltipRect.attr("display", 'none');
    // }
    // else {
    //     tooltipRect.attr("display", null);
    // }
    // tooltipRect.attr("width", tooltipDims[0]).attr("height", tooltipDims[1]);

    updateDivWidth();
    updateTranslation();

    tooltipGroup
      .attr(
        "transform",
        "translate(" + translation[0] + "," + translation[1] + ")"
      )
      .style("left", translation[0] + "px")
      .style("top", translation[1] + "px");
  }

  function hideTooltip() {
    tooltipGroup.style("display", "none");
  }

  function moveTooltip(e, d) {
    displayTooltip(e, d);
    updateTranslation();
    tooltipGroup
      .attr(
        "transform",
        "translate(" + translation[0] + "," + translation[1] + ")"
      )
      .raise();
  }

  tooltip.displayTooltip = displayTooltip;
  tooltip.hideTooltip = hideTooltip;
  tooltip.moveTooltip = moveTooltip;
  tooltip.setCurrentEvent = (e) => {
    currentEvent = e;
  };

  tooltip.events = function () {
    let me = d3.select(this).on("mouseenter") || function () {};
    let ml = d3.select(this).on("mouseleave") || function () {};
    let mm = d3.select(this).on("mousemove") || function () {};

    d3.select(this)
      .on("mouseenter", function (e, d) {
        currentEvent = e;
        me(e, d);
        displayTooltip(e, d);
      })
      .on("mouseleave", function (e, d) {
        currentEvent = e;
        ml(e, d);
        hideTooltip();
      })
      .on("mousemove", function (e, d) {
        currentEvent = e;
        mm(e, d);
        moveTooltip(e, d);
      });
  };

  tooltip.extent = function (_extent) {
    extent = _extent || extent;
    return tooltip;
  };

  tooltip.fontSize = function (_fontSize) {
    fontSize = _fontSize || fontSize;
    return tooltip;
  };

  tooltip.margin = function (_margin) {
    margin = _margin || margin;
    return tooltip;
  };

  tooltip.padding = function (_padding) {
    padding = _padding || padding;
    return tooltip;
  };

  tooltip.tips = function (_tips, _tipNames, _tipFormats, _dataProcessfunc) {
    tips = _tips || tips;
    tipNames = _tipNames || tips;
    tipFormats =
      _tipFormats ||
      tips.map(function () {
        return null;
      });
    if (_dataProcessfunc != null) {
      dataProcess = _dataProcessfunc;
    }
    return tooltip;
  };

  // function updateTooltipDims() {
  //     let bb = tooltipText.node().getBBox();
  //     tooltipDims = [bb.width + padding[0] * 2, bb.height + padding[1] * 2];
  // }

  function updateDivWidth() {
    let text_box = document
      .getElementById("tooltip-text")
      .getBoundingClientRect();
    let text_w = Math.min(text_box.width, extent[1][0] / 5) + 10;
    tooltipGroup.style("width", text_w + "px");
  }

  function updateTranslation() {
    // let mouseCoordinates = d3.pointer(currentEvent, frameOfReference);

    let text_box = document
      .getElementById("tooltip-text")
      .getBoundingClientRect();

    translation[0] = currentEvent.x - 100;
    translation[1] = currentEvent.y + 50;

    if (translation[0] + text_box.width > extent[1][0]) {
      translation[0] = extent[1][0] - text_box.width - 15;
    }

    if (translation[0] < extent[0][0]) {
      translation[0] = 15;
    }
  }

  return tooltip;
}
