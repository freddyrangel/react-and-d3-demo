import React, { Component } from 'react';
import d3                   from 'd3';
import _                    from 'lodash';

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
      return <h1>Loading...</h1>
    } else {
      const columns = Object.keys(data[0]);
      return <table className="table">
        <thead>
          <tr>
            { columns.map((column, i) => <th key={i}>{column}</th>) }
          </tr>
        </thead>
        <tbody>
          { this.renderRows(data, columns) }
        </tbody>
      </table>
    }
  }
}
