
import React from 'react';
import d3 from 'd3';

const ScatterPlot = ({ x, y, width, height, yValue, xValue, data}) => {
    let xScale = d3.scaleLinear()
                   .domain([0, d3.max(data, xValue)])
                   .range([0, width]),
        yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, yValue)])
                   .range([0, height]),
        transform = `translate(${x}, ${y})`;

    return (
        <g transform={transform}>
            {data.map((d, i) =>
                <circle cx={xScale(xValue(d))}
                cy={yScale(yValue(d))}
                r="3"
                key={`point-${i}`}
                style={{fillOpacity: .1, strokeOpacity: .3}} />
             )}
        </g>
    );
};

export default ScatterPlot;
