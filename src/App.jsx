
import React, { Component } from 'react';
import d3 from 'd3';

import Piechart from './components/Piechart';
import Barchart from './components/Barchart';
import Filter from './components/Filter';

class App extends Component {
    state = {data: [],
             filter: () => true}

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

    updateFilter(filter) {
        this.setState({filter: filter});
    }

    render() {
        let filteredData = this.state.data.filter(this.state.filter);

        debugger;

        return (
            <div className="container">
                <h2>A FreeCodeCamp Survey exploration</h2>
                <Filter filterByKey="already_working"
                        getFilter={::this.updateFilter}/>
                <svg width="800" height="600">
                    <Barchart x="20"
                              y="100"
                              height="300"
                              width="500"
                              data={filteredData}
                              value={(d) => d.which_role} />
                </svg>
            </div>
        );
    }
}

export default App;
