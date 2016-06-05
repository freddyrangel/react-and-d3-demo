import React, { Component } from 'react';
import d3                   from 'd3';
import _                    from 'lodash';

import Barchart             from './components/Barchart';
import { BucketedScatterPlot } from './components/ScatterPlot';

const parseRow = (d) => {
  return {
    id                : d.NetworkID,
    jobRoleInterest   : d.JobRoleInterest,
    alreadyWorking    : Boolean(Number(d.IsSoftwareDev)),
    expectedEarning   : Number(d.ExpectedEarning),
    age               : Number(d.Age),
    hoursLearning     : Number(d.HoursLearning),
    monthsProgramming : Number(d.MonthsProgramming),
    moneyForLearning  : Number(d.MoneyForLearning),
    commuteTime       : Number(d.CommuteTime),
    income            : Number(d.Income),
    jobPref           : d.JobPref,
    jobWherePref      : d.JobWherePref,
    jobRelocate       : Boolean(Number(d.JobRelocate)),
    jobApplyWhen      : Number(d.JobApplyWhen)
  };
};

const fixRow = (d) => {
    if (d.expect_earn < 10000) d.expect_earn *= 12;
    return d;
};

export default class App extends Component {

  state = { data : [] };

  componentWillMount() {
    d3.csv('./2016-FCC-New-Coders-Survey-Data.csv')
      .row(fixRow(parseRow))
      .get((err, data) => {
        // Get data, make sure each data point has unique id, and set state
        this.setState({data: _.uniqBy(data, (d) => d.id)});
      });
  }

  renderRows = (data, columns) => {
    return data.map((d, i) => <tr key={i}>{this.renderCells(d, columns)}</tr>);
  }

  renderCells = (d, columns) => {
    return columns.map((column, i) => <td key={i}>{d[column]}</td>);
  }

  render() {
      const { data } = this.state;

      if (data.length === 0) {
          return (<h1>Loading...</h1>)
      } else {

          return (
              <div className="container">
                  <svg width="900" height="600">
                      <g>
                          <Barchart x="20"
                                    y="100"
                                    height="500"
                                    width="800"
                                    data={data}
                                    value={(d) => d['jobPref']} />

                          <BucketedScatterPlot x="225"
                                               y="100"
                                               height={480}
                                               width={800-220}
                                               data={data}
                                               bucket={(d) => d['jobPref']}
                                               value={(d) => d['income']} />
                      </g>
                  </svg>
              </div>
          )
      }
  }
}
