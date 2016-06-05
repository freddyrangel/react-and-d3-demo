import React, { Component } from 'react';
import d3                   from 'd3';

const Bar = ({ x, y, width, height, name }) => (
    <rect x={x} y={y} width={width} height={height}
          style={{fill: 'steelblue', fillOpacity: .4}}
          title={name} />
);

const LabeledBar = ({name, x, y, height, labelMargin, ...params}) => {
    let transform = `translate(${x}, ${y})`;

    return (
        <g transform={transform}>
            <text y={height/2+3} x={labelMargin-10}
                  textAnchor="end">{name}</text>

            <Bar x={labelMargin}
                 y="0"
                 height={height}
                 {...params} />
        </g>
    );
};

class Barchart extends Component {
    labelMargin = 220;
    bottomMargin = 20;
    xScale = d3.scaleLinear();
    yScale = d3.scaleOrdinal();

    get drawHeight() {
        return this.props.height - this.bottomMargin;
    }

    get barHeight() {
        let N_buckets = this.buckets.length;

        return (this.drawHeight - N_buckets*3)/N_buckets;
    }

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(props) {
        let buckets = this.buckets = d3.nest()
                                       .key(props.value)
                                       .sortKeys(d3.ascending)
                                       .entries(props.data),
            N_buckets = buckets.length;

        this.xScale
            .domain([0, d3.max(buckets,
                               ({key, values}) => values.length)])
            .range([0, props.width-this.labelMargin]);

        this.yScale
            .domain(buckets.map(({key, values}) => key))
            .range(d3.range(0, this.barHeight*N_buckets, this.barHeight+3));
    }

    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        return (
            <g transform={transform}>
                {this.buckets.map(({ key, values }, i) => (
                    <LabeledBar x={0}
                                y={this.yScale(i)}
                                width={this.xScale(values.length)}
                                height={this.barHeight}
                                name={key}
                                key={`bar-${key}`}
                                labelMargin={this.labelMargin}/>
                 ))}
            </g>
        );
    }
}

export default Barchart;
