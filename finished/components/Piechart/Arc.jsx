import React, { Component } from 'react';
import d3                   from 'd3';

let colors = d3.scaleCategory10();

class Arc extends Component {
    constructor() {
        super();

        this.arc = d3.arc();
    }

    componentWillMount() {
        this.updateD3(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(newProps) {
        this.arc.innerRadius(newProps.innerRadius);
        this.arc.outerRadius(newProps.outerRadius);
    }

    drawArc() {
        return (
            <path d={this.arc(this.props.data)}
                  style={{fill: colors(this.props.i)}}></path>
        )
    }

    render() {
        return this.drawArc();
    }
}

class LabeledArc extends Arc {
    render() {
        let [labelX, labelY] = this.arc.centroid(this.props.data),
            labelTranslate = `translate(${labelX}, ${labelY})`;

        return (
            <g>
                {this.drawArc()}
            <text transform={labelTranslate}>
                {this.props.data.data.label}
            </text>
            </g>
        );
    }
}

export { LabeledArc };
export default Arc;
