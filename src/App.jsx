import './style.less';
import React, { Component } from 'react';
import d3                   from 'd3';
import _                    from 'lodash';
import Piechart             from 'components/Piechart';
import Barchart             from 'components/Barchart';
import Picker               from 'components/Picker';
import BucketedScatterPlot  from 'components/BucketedScatterPlot';
import ScatterPlot          from 'components/ScatterPlot';
import { TopAxis, LeftAxis }from 'components/Axis';

const parseRow = (d) => {
    return {
        id              : d.NetworkID,
        jobRoleInterest    : d.JobRoleInterest,
        alreadyWorking : Boolean(Number(d.IsSoftwareDev)),
        expectedEarning     : Number(d.ExpectedEarning),
        age             : Number(d.Age),
        hoursLearning  : Number(d.HoursLearning),
        monthsProgramming : Number(d.MonthsProgramming),
        moneyForLearning : Number(d.MoneyForLearning),
        commuteTime : Number(d.CommuteTime),
        income          : Number(d.Income),
        jobPref  : d.JobPref,
        jobWherePref       : d.JobWherePref,
        jobRelocate : Boolean(Number(d.JobRelocate)),
        jobApplyWhen : Number(d.JobApplyWhen)
    };
};

const fixRow = (d) => {
    if (d.expect_earn < 10000) d.expect_earn *= 12;
    return d;
};

const QualitativeChart = ({ xKey, yKey, data }) => (
    <g>
        <Barchart x="20"
                  y="100"
                  height="500"
                  width="800"
                  data={data}
                  value={(d) => d[yKey]} />

        <BucketedScatterPlot x="220"
                             y="100"
                             height="480"
                             width={800-220}
                             data={data}
                             bucket={(d) => d[yKey]}
                             value={(d) => d[xKey]} />

        <TopAxis data={data}
                 value={(d) => d[xKey]}
                 maxDimension={800-220}
                 x={220}
                 y={95}
                 className="topAxis" />
    </g>
);

const QuantitativeChart = ({ xKey, yKey, data }) => (
    <g>
        <ScatterPlot x="220"
                     y="100"
                     height="480"
                     width={800-220}
                     data={data}
                     yValue={(d) => d[yKey]}
                     xValue={(d) => d[xKey]} />

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

class App extends Component {

    state = {
        data      : [],
        yKey : 'jobRoleInterest',
        xKey : 'income'
    };

    qualitativeOptions = ['jobRoleInterest', 'alreadyWorking', 'jobPref', 'jobWherePref', 'jobRelocate'];

    quantitativeOptions = ['expectedEarning', 'age', 'hoursLearning', 'monthsProgramming', 'moneyForLearning', 'commuteTime', 'income'];


    componentWillMount() {
        d3.csv('./2016-FCC-New-Coders-Survey-Data.csv')
            .row((d) => fixRow(parseRow(d)))
            .get((err, data) => {
                this.setState({data: _.uniqBy(data, (d) => d.id)});
            });
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

        if (this.qualitativeOptions.includes(yKey)) {
            chart = <QualitativeChart xKey={xKey}
                                      yKey={yKey}
                                      data={data} />
        }else{
            chart = <QuantitativeChart xKey={xKey}
                                       yKey={yKey}
                                       data={data} />
        }


        return (
            <div className="container">
                <h2>FreeCodeCamp Survey correlation explorer</h2>

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
        );
    }
}

export default App;
