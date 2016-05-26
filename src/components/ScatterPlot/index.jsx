import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import { findDOMNode }      from 'react-dom';
import d3                   from 'd3';
import _                    from 'lodash';

class PlotDot extends Component {

    componentWillMount() {
        this._isMounted = true;
        this.setState({x: this.props.x,
                       y: this.props.y});
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.cancelTransitions();
    }

    componentWillReceiveProps(nextProps) {
        if (this._isMounted) {
            if (this.state.x != nextProps.x || this.state.y != nextProps.y) {
                let node = d3.select(findDOMNode(this));

                node.transition(this.props.transition)
                    .attr('cx', nextProps.x)
                    .attr('cy', nextProps.y)
                    .on('end', () => {
                        this.setState({x: nextProps.x,
                                       y: nextProps.y})
                    });
            }
        } else {
            this.cancelTransitions();
        }
    }

    cancelTransitions() {
        let node = d3.select(findDOMNode(this));
        node.interrupt();
    }

    render() {
        return (
            <circle cx={this.state.x}
                    cy={this.state.y}
                    r="3"
                    style={{fillOpacity: .1, strokeOpacity: .3}} />
        );
    }
}

class ScatterPlot extends Component {
    data = {data: []};
    xScale = d3.scaleLinear();
    yScale = d3.scaleLinear();

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(props) {
        let xScale = this.xScale
            .domain([0, props.maxX || d3.max(props.data, props.xValue)])
            .range([0, props.width]);

        let yScale = this.yScale
            .domain([0, props.maxY || d3.max(props.data, props.yValue)])
            .range([0, props.height]);

        let occupied = new Array(props.width+1);
        d3.range(props.width+1)
          .forEach((i) => {
              occupied[i] = new Array(props.height+1).fill(0)
          });

        let data = props.data.map((d) => {
            d.x = Math.round(xScale(props.xValue(d)));
            d.y = Math.round(yScale(props.yValue(d)));
            return d;
        }).filter((d) => !_.isNaN(d.x) && !_.isNaN(d.y))
          .filter((d) => {
              occupied[d.x][d.y] += 1;

              return !(occupied[d.x][d.y] > 10);
        });

        this.setState({data: data});
    }

    render() {
        let { x, y, yValue, xValue } = this.props,
            data = this.state.data;

        let transform = `translate(${x}, ${y})`,
            transition = d3.transition()
                           .duration(5000);

        console.log(`Drawing ${data.length} datapoints`);

        return (
            <g transform={transform}>
                    {data.map((d, i) => (
                        <PlotDot x={d.x}
                        y={d.y}
                        transition={transition}
                        key={`point-${d.id}`} />
                     ))}
            </g>
        );
    }
}

export default ScatterPlot;
