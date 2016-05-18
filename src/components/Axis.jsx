
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Axis extends Component {

    constructor(props) {
        super();

        this.scale = d3.scaleLinear();
        this.axis = d3.axisBottom(this.scale);

        this.updateD3(props);
    }

    componentWillReceiveProps(newProps) {
        this.updateD3(newProps);
    }

    updateD3(props) {
        this.scale
            .domain([0,
                     d3.max(props.data, props.value)])
            .range([0, props.maxDimension]);

        // should prob be handled with default props instead
        let tickFormat = (d) => this.scale.tickFormat()(d);
        if (props.tickFormat) {
            tickFormat = props.tickFormat;
        }

        this.axis.tickFormat(tickFormat)
    }

    componentDidUpdate() { this.renderAxis(); }
    componentDidMount() { this.renderAxis(); }

    renderAxis() {
        let node = ReactDOM.findDOMNode(this);

        d3.select(node).call(this.axis);
    }

    render() {
        let translate = `translate(${this.props.x}, ${this.props.y})`;
        return (
            <g className={`axis ${this.props.className}`} transform={translate}>
            </g>
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

export default Axis;
export { BottomAxis, TopAxis };
