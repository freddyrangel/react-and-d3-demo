
import React, { Component } from 'react';

const Toggle = ({ name, label, value, tellValue }) => {
    let btnType = value ? 'btn-primary' : 'btn-default';

    return (
        <button className={`btn btn-large ${btnType}`}
                onClick={() => tellValue(name, !value)}>
            {label}
        </button>
    );
};

class Filter extends Component {
    state = {values: {btn1: false,
                      btn2: false}};

    updateFilter(key, value) {
        let values = this.state.values;
        values[key] = value;
        this.setState({values: values});

        let {btn1, btn2} = this.state.values,
            newFilter = (d) => true;

        if (btn1) {
            newFilter = (d) => d[this.props.filterByKey];
        }else if (btn2) {
            newFilter = (d) => !d[this.props.filterByKey];
        }

        this.props.getFilter(newFilter);
    }

    render() {
        return (
            <div>
                <Toggle label="Works as Developer"
                        name="btn1"
                        value={this.state.values.btn1}
                        tellValue={::this.updateFilter} />
                &nbsp;
                <Toggle label="Doesn't work as Developer"
                        name="btn2"
                        value={this.state.values.btn2}
                        tellValue={::this.updateFilter} />
            </div>
        );
    }
};

export default Filter;
