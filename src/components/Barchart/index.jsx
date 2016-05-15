
import React, { Component } from 'react';
import d3 from 'd3';

const Bar = ({ x, y, width, height, name }) => (
    <rect x={x} y={y} width={width} height={height}
          style={{fill: 'steelblue'}}
          title={name} />
);

class Barchart extends Component {
    constructor() {
        super();

        this.xScale = d3.scaleLinear();
        this.yScale = d3.scaleOrdinal();
    }

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(newProps) {
        let counts = this.counts = d3.nest()
                        .key(newProps.value)
                        .sortKeys(d3.ascending)
                        .entries(newProps.data);

        let barHeight = (newProps.height-(this.counts.length*3))/this.counts.length;

        this.xScale
            .domain([0, d3.max(counts,
                               ({key, values}) => values.length)])
            .range([0, newProps.width]);

        this.yScale
            .domain(counts.map(({key, values}) => key))
            .range(d3.range(0, barHeight*counts.length, barHeight+3));
    }

    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        let barHeight = (this.props.height-(this.counts.length*3))/this.counts.length;

        return (
            <g transform={transform}>
                {this.counts.map(({ key, values }, i) => (
                    <Bar x={0}
                         y={-this.yScale(i)}
                         width={this.xScale(values.length)}
                         height={barHeight}
                         name={key}
                         key={`bar-${key}`} />
                 ))}
            </g>
        );
    }
}

export default Barchart;
