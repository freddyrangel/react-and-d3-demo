
import React, { Component } from 'react';
import d3 from 'd3';

import Piechart from './components/Piechart';
import Barchart from './components/Barchart';
import Filter from './components/Filter';
import BucketedScatterPlot from './components/BucketedScatterPlot';

class App extends Component {
    state = {data: [],
             filter: () => true}

    parseRow(d) {
        return {
            which_role: d.JobRoleInterest || '',
            already_working: Boolean(Number(d.IsSoftwareDev)),
            expect_earn: Number(d.ExpectedEarning),
            age: Number(d.Age),
            hours_learning: Number(d.HoursLearning),
            income: Number(d.Income),
            job_preference: Number(d.JobPref),
            job_where: Number(d.JobWherePref)
        };
    }

    fixRow(d) {
        if (d.expect_earn < 10000) {
            d.expect_earn *= 12;
        }

        return d;
    }

    componentWillMount() {
        d3.csv('https://raw.githubusercontent.com/erictleung/2016-new-coder-survey/clean-and-combine-data/clean-data/2016-FCC-New-Coders-Survey-Data.csv')
          .row((d) => this.fixRow(this.parseRow(d)))
          .get((err, data) => {
              this.setState({data: data.filter((d) => d.expect_earn)});
          });

    }

    updateFilter(filter) {
        this.setState({filter: filter});
    }

    render() {
        let filteredData = this.state.data.filter(this.state.filter);

        return (
            <div className="container">
                <h2>A FreeCodeCamp Survey exploration</h2>
                <Filter filterByKey="already_working"
                        getFilter={::this.updateFilter}/>
                <svg width="800" height="600">
                    <Barchart x="20"
                              y="100"
                              height="500"
                              width="500"
                              data={filteredData}
                              value={(d) => d.which_role} />
                    <BucketedScatterPlot x="220"
                                         y="100"
                                         height="500"
                                         width="500"
                                         data={filteredData}
                                         bucket={(d) => d.which_role} />
                </svg>
            </div>
        );
    }
}

export default App;
