
import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import _ from 'lodash';

class PlotDot extends Component {

    componentWillMount() {
        this.setState({x: this.props.x,
                       y: this.props.y});
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.x != nextProps.x || this.state.y != nextProps.y) {
            let node = d3.select(ReactDOM.findDOMNode(this));

            node.transition(this.props.transition)
                .attr('cx', nextProps.x)
                .attr('cy', nextProps.y)
                .on('end', () => this.setState({x: nextProps.x, y: nextProps.y}));
        }
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

const ScatterPlot = ({ x, y, width, height, yValue, xValue, maxY, maxX, data}) => {
    let xScale = d3.scaleLinear()
                   .domain([0, maxX || d3.max(data, xValue)])
                   .range([0, width]),
        yScale = d3.scaleLinear()
                   .domain([0, maxY || d3.max(data, yValue)])
                   .range([0, height]),
        transform = `translate(${x}, ${y})`,
        transition = d3.transition()
                       .duration(3000);

    console.log("rendering dots", Number(new Date()));

    return (
        <g transform={transform}>
        {data.map((d, i) => {
            let x = xValue(d),
                y = yValue(d);

            if (!_.isNaN(x) && !_.isNaN(y)) {
                return (<PlotDot x={xScale(xValue(d))}
                                 y={yScale(yValue(d))}
                                 transition={transition}
                                 key={`point-${d.id}`} />)
            }else{
                return null;
            }
        })}
        </g>
    );
};

export default ScatterPlot;
