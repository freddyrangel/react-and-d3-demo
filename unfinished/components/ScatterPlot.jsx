import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import { findDOMNode }      from 'react-dom';
import d3                   from 'd3';
import _                    from 'lodash';

class ScatterPlot extends Component {
    xScale = d3.scaleQuantize();
    yScale = d3.scaleQuantize();
    precision = 3;

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(props) {
        let { x, y, width, height, yValue, xValue, maxY, maxX, data } = props;

        let xScale = this.xScale
                         .domain([0, maxX || d3.max(data, xValue)])
                         .range(d3.range(0, props.width, this.precision));

        let yScale = this.yScale
                         .domain([0, maxY || d3.max(data, yValue)])
                         .range(d3.range(0, props.height, this.precision));
    }

    isValidPos(d) {
        return !(_.isNaN(d.x) || _.isNaN(d.y) || _.isUndefined(d.x) || _.isUndefined(d.y))
    }

    get reducedData() {
        let { width, height, data, xValue, yValue } = this.props;

        width = Number(width);
        height = Number(height);

        let occupied = new Array(width+this.precision);

        d3.range(width+this.precision)
          .forEach((i) => {
              occupied[i] = new Array(height+this.precision).fill(0)
          });

        return data.map((d) => {
            d.x = this.xScale(xValue(d));
            d.y = this.yScale(yValue(d));
            return d;
        })
                   .filter(this.isValidPos)
                   .filter((d) => {
                       occupied[d.x][d.y] += 1;

                       return !(occupied[d.x][d.y] > 10);
                   });
    }

    render() {
        let { x, y, yValue, xValue } = this.props;

        let transform = `translate(${x}, ${y})`,
            data = this.reducedData;

        return (
            <g transform={transform}>
                {data.map((d, i) => (
                    <circle cx={d.x}
                            cy={d.y}
                            r={3}
                            key={`point-${d.id}`}
                            style={{fillOpacity: .1, strokeOpacity: .3}}/>
                ))}
            </g>
        );
    }
}


class BucketedScatterPlot extends Component {
    yScale = d3.scaleOrdinal();

    get barHeight() {
        let N_buckets = this.props.bucketedData.length;

        return (this.props.height - N_buckets*3)/N_buckets;
    }

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(newProps) {
        let buckets = newProps.bucketedData,
            N_buckets = buckets.length;

        this.yScale
            .domain(buckets.map(({key, values}) => key))
            .range(d3.range(0, this.barHeight*N_buckets, this.barHeight+3));
    }

    render() {
        let transform = `translate(${this.props.x}, ${this.props.y})`;

        if (this.props.data.length < 1) {
            return null;
        }

        let { width, bucket, value, data } = this.props;

        let height = Math.round(this.props.height - this.barHeight/2),
            yValue = (d) => this.yScale(bucket(d));

        return (
            <g transform={transform}>
                <ScatterPlot x={0}
                             y={this.barHeight/2}
                             width={width}
                             height={height}
                             yValue={(d) => this.yScale(this.props.bucket(d))}
                             xValue={value}
                             maxY={height}
                             data={data} />
            </g>
        );
    }
}


export default ScatterPlot;
export { BucketedScatterPlot };
