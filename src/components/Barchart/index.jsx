
import React, { Component } from 'react';
import d3 from 'd3';

const Bar = ({ x, y, width, height, name }) => (
    <rect x={x} y={y} width={width} height={height}
          style={{fill: 'steelblue'}}
          title={name} />
);

class Barchart extends Component {
    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        let counts = d3.nest()
                       .key(this.props.value)
                       .sortKeys(d3.ascending)
                       .entries(this.props.data);

        let barWidth = (this.props.width-(counts.length*3))/counts.length,

            xScale = d3.scaleOrdinal()
                       .domain(counts.map(({key, values}) => key))
                       .range(d3.range(0, barWidth*counts.length, barWidth+3)),

            valScale = d3.scaleLinear()
                         .domain([0, d3.max(counts,
                                            ({key, values}) => values.length)])
                         .range([0, this.props.height]);

        return (
            <g transform={transform}>
                {counts.map(({ key, values }, i) => (
                    <Bar x={xScale(i)}
                         y={-valScale(values.length)}
                         width={barWidth}
                         height={valScale(values.length)}
                         name={key}
                         key={`bar-${key}`} />
                 ))}
            </g>
        );
    }
}

export default Barchart;
