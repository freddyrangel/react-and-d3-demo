
import React, { Component } from 'react';
import d3 from 'd3';

import ScatterPlot from '../ScatterPlot';

class BucketedScatterPlot extends Component {
    yScale = d3.scaleOrdinal();

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(newProps) {
        let buckets = this.buckets = d3.nest()
                                       .key(newProps.bucket)
                                       .sortKeys(d3.ascending)
                                       .entries(newProps.data);

        let bucketHeight = (newProps.height-(this.buckets.length*3))/this.buckets.length;

        this.yScale
            .domain(buckets.map(({key, values}) => key))
            .range(d3.range(0, bucketHeight*buckets.length, bucketHeight+3));
    }

    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        let bucketHeight = (this.props.height-(this.buckets.length*3))/this.buckets.length;

        return (
            <g transform={transform}>
                {this.buckets.map(({key, values}, i) => (
                    <ScatterPlot x={0}
                                 y={this.yScale(i)+bucketHeight/2}
                                 width={this.props.width}
                                 height={bucketHeight}
                                 yValue={() => 0}
                                 xValue={this.props.value}
                                 data={values}
                                 key={`scatterplot-${key}`} />
                 ))}
            </g>
        );
    }
}

export default BucketedScatterPlot;
