const canvas = {width: 900, height: 500};
const margin = {top: 50, left: 50, bottom: 70, right: 70};
const chart_dimensions = {
    width: canvas.width - (margin.left + margin.right),
    height: canvas.height - (margin.top + margin.bottom)
};

let brush;

var frame = -1;

const x1scale = d3.scaleBand();
const x2scale = d3.scaleBand();
const x3scale = d3.scaleBand();

const y_debt = d3.scaleLinear();
const y_ratio = d3.scaleLinear();
const y_rate = d3.scaleLinear();
const y_pred_debt = d3.scaleLinear();
let chart;

const y_axis_right = d3.axisRight();
const y_axis_left = d3.axisLeft();
const x_axis = d3.scaleBand();
const legend_color = {
        "Predicted Federal Debt": "#1f77b4",
        "Predicted Household Debt": "#d62728"
};

const categoryDiscreteColorScale = d3.scaleOrdinal()
    .domain(d3.keys(legend_color))
    .range(d3.values(legend_color));

var filter_applied = false;
var year_filter = { min: -1, max: -1 };
var citations_filter = { min: -1, max: -1 };

var brush_applied = false;
var year_brush = { min: -1, max: -1 };
var citations_brush = { min: -1, max: -1 };
var category_filter = {
    "Review": true,
    "Article": true,
    "Press Article": true,
    "Conference": true,
    "Book": true,
    "Open Access": true,
    "Short Survey": true,
    "Note": true,
    "Unknown": true,
    "Abstract Report": true
};

var scene1data, scene2data, debt_data, income_data, ratio_data, inflation_data, interest_data, eff_interest_data;
var scene3data = {};
var svg;
