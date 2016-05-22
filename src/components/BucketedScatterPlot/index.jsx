
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

        if (this.props.data.length < 1) {
            return null;
        }

        let bucketHeight = (this.props.height-(this.buckets.length*3))/this.buckets.length;

        return (
            <g transform={transform}>
                <ScatterPlot x={0}
                             y={bucketHeight/2}
                             width={this.props.width}
                             height={Math.round(this.props.height - bucketHeight/2)}
                             yValue={(d) => this.yScale(this.props.bucket(d))}
                             maxY={this.props.height - bucketHeight/2}
                             xValue={this.props.value}
                             data={this.props.data} />
            </g>
        );
    }
}

export default BucketedScatterPlot;
