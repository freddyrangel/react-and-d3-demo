import React, { Component } from 'react';
import { findDOMNode }      from 'react-dom';
import d3                   from 'd3';

class Axis extends Component {

    constructor(props) {
        super(props);
        this.scale  = d3.scaleLinear();
        this.axis   = d3.axisBottom(this.scale);
        this.updateD3(props);
    }

    componentDidUpdate()                { this.renderAxis(); }
    componentDidMount()                 { this.renderAxis(); }
    componentWillReceiveProps(newProps) { this.updateD3(newProps); }

    updateD3(props) {
        let {data, value, maxDimension, tickFormat} = props
        this.scale
            .domain([0, d3.max(data, value)])
            .range([0, maxDimension]);

        // should prob be handled with default props instead
        if (!!tickFormat) tickFormat = (d) => this.scale.tickFormat()(d);
        this.axis.tickFormat(tickFormat)
    }

    renderAxis() {
        let node = findDOMNode(this);
        d3.select(node).call(this.axis);
    }

    render() {
        let translate = `translate(${this.props.x}, ${this.props.y})`;
        return (
            <g className={`axis ${this.props.className}`} transform={translate} />
        );
    }
}

class BottomAxis extends Axis {
    constructor(props) {
        super(props);
        this.axis = d3.axisBottom(this.scale);
        super.updateD3(props);
    }
}

class TopAxis extends Axis {
    constructor(props) {
        super(props);
        this.axis = d3.axisTop(this.scale);
        super.updateD3(props);
    }
}

class LeftAxis extends Axis {
    constructor(props) {
        super(props);
        this.axis = d3.axisLeft(this.scale);
        super.updateD3(props);
    }
}

export default Axis;
export { BottomAxis, TopAxis, LeftAxis };
