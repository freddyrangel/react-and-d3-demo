import React, { Component } from 'react';
import d3                   from 'd3';
import _                    from 'lodash';

import Barchart             from './components/Barchart';
import ScatterPlot, { BucketedScatterPlot } from './components/ScatterPlot';
import { TopAxis, BottomAxis, LeftAxis } from 'components/Axis';
import Picker               from 'components/Picker';


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

const QualitativeChart = ({ xKey, yKey, data, bucketedData }) => (
    <g>
        <Barchart x="20"
                  y="100"
                  height="500"
                  width="800"
                  bucketedData={bucketedData}
                  value={(d) => d[yKey]} />

        <BucketedScatterPlot x="240"
                             y="100"
                             height={480}
                             width={800-220}
                             bucketedData={bucketedData}
                             data={data}
                             bucket={(d) => d[yKey]}
                             value={(d) => d[xKey]} />

        <TopAxis data={data}
                 value={(d) => d[xKey]}
                 maxDimension={800-220}
                 x={240}
                 y={95}
                 className="topAxis" />

        <BottomAxis data={bucketedData}
                    value={(d) => d.values.length}
                    maxDimension={800-220}
                    x={240}
                    y={580}
                    className="bottomAxis"/>
    </g>
);

const QuantitativeChart = ({ xKey, yKey, data, bucketedData }) => (
    <g>
        <ScatterPlot x="220"
                     y="100"
                     height={480}
                     width={800-220}
                     data={data}
                     yValue={(d) => d[yKey]}
                     xValue={(d) => d[xKey]}
                     precision={8} />

        <TopAxis data={data}
                 value={(d) => d[xKey]}
                 maxDimension={800-220}
                 x={220}
                 y={95}
                 className="topAxis" />

        <LeftAxis data={data}
                  value={(d) => d[yKey]}
                  maxDimension={480}
                  x={220}
                  y={100}
                  className="leftAxis" />
    </g>
);


export default class App extends Component {

    state = { data : [],
              yKey: 'jobPref',
              xKey: 'income' };

    qualitativeOptions = ['jobRoleInterest', 'alreadyWorking', 'jobPref', 'jobWherePref', 'jobRelocate'];

    quantitativeOptions = ['expectedEarning', 'age', 'hoursLearning', 'monthsProgramming', 'moneyForLearning', 'commuteTime', 'income'];


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

    pickY(newKey) {
        this.setState({yKey: newKey});
    }

    pickX(newKey) {
        this.setState({xKey: newKey});
    }


  render() {
      let { xKey, yKey, data } = this.state,
          chart;

      if (data.length === 0) {
          return (<h1>Loading...</h1>)
      } else {

          let bucketedData = d3.nest()
                               .key((d) => d[yKey])
                               .sortKeys(d3.ascending)
                               .entries(data);

          if (this.qualitativeOptions.includes(yKey)) {
              chart = (<QualitativeChart xKey={xKey}
                                         yKey={yKey}
                                         data={data}
                                         bucketedData={bucketedData} />)
          }else{
              chart = (<QuantitativeChart xKey={xKey}
                                          yKey={yKey}
                                          data={data}
                                          bucketedData={bucketedData} />)
          }


          return (
              <div className="container">
                  <h1>FreeCodeCamp Survey Data Explorer</h1>
                  <div>
                      Choose X axis
                      <Picker options={this.quantitativeOptions}
                              onPick={::this.pickX}
                              picked={this.state.xKey} />
                  </div>

                  <div>
                      Choose Y axis
                      <Picker options={this.quantitativeOptions.concat(this.qualitativeOptions)}
                              onPick={::this.pickY}
                              picked={this.state.yKey} />
                  </div>

                  <svg width="900" height="600">
                      {chart}
                  </svg>
              </div>
          )
      }
  }
}
