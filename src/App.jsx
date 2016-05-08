
import React, { Component } from 'react';
import d3 from 'd3';

import Piechart from './components/Piechart';

class App extends Component {
    state = {data: []}

    componentWillMount() {
        d3.csv('data/survey_data_part1.csv')
          .row((d) => {
              return {
                  which_role: d['Which one of these roles are you most interested in?'],
                  already_working: Boolean(Number(d['Are you already working as a software developer?'])),
                  expect_earn: Number(d['About how much money do you expect to earn per year at your first developer job (in US Dollars)?'])
              };
          })
          .get((error, rows) => {
              this.setState({data: rows});
          });
    }

    render() {

        let pieData = [{label: 'Is coder',
                        value: this.state.data.filter((d) => d.already_working).length},
                       {label: 'Not coder',
                        value: this.state.data.filter((d) => !d.already_working).length}];

        return (
            <div className="container">
                <h2>A FreeCodeCamp Survey exploration</h2>
                <svg width="800" height="600">
                    <Piechart x="200"
                              y="200"
                              innerRadius="50"
                              outerRadius="150"
                              data={pieData} />
                </svg>
            </div>
        );
    }
}

export default App;
