"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var unitlessNumbers = new Set(["animationIterationCount", "aspectRatio", "borderImageOutset", "borderImageSlice", "borderImageWidth", "boxFlex", "boxFlexGroup", "boxOrdinalGroup", "columnCount", "columns", "flex", "flexGrow", "flexPositive", "flexShrink", "flexNegative", "flexOrder", "gridArea", "gridRow", "gridRowEnd", "gridRowSpan", "gridRowStart", "gridColumn", "gridColumnEnd", "gridColumnSpan", "gridColumnStart", "fontWeight", "lineClamp", "lineHeight", "opacity", "order", "orphans", "scale", "tabSize", "widows", "zIndex", "zoom", "fillOpacity", // SVG-related properties
    "floodOpacity", "stopOpacity", "strokeDasharray", "strokeDashoffset", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "MozAnimationIterationCount", // Known Prefixed Properties
    "MozBoxFlex", // TODO: Remove these since they shouldn't be used in modern code
    "MozBoxFlexGroup", "MozLineClamp", "msAnimationIterationCount", "msFlex", "msZoom", "msFlexGrow", "msFlexNegative", "msFlexOrder", "msFlexPositive", "msFlexShrink", "msGridColumn", "msGridColumnSpan", "msGridRow", "msGridRowSpan", "WebkitAnimationIterationCount", "WebkitBoxFlex", "WebKitBoxFlexGroup", "WebkitBoxOrdinalGroup", "WebkitColumnCount", "WebkitColumns", "WebkitFlex", "WebkitFlexGrow", "WebkitFlexPositive", "WebkitFlexShrink", "WebkitLineClamp"]);
function default_1(name) {
    return unitlessNumbers.has(name);
}
exports.default = default_1;
