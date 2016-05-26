import './style.less';
import React, { Component } from 'react';
import d3                   from 'd3';
import _                    from 'lodash';
import Piechart             from 'components/Piechart';
import Barchart             from 'components/Barchart';
import Picker               from 'components/Picker';
import BucketedScatterPlot  from 'components/BucketedScatterPlot';
import ScatterPlot          from 'components/ScatterPlot';
import { TopAxis }          from 'components/Axis';

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

class App extends Component {

    state = {
        data      : [],
        bucketKey : 'jobRoleInterest',
        distroKey : 'income'
    };

    qualitative_options = ['jobRoleInterest', 'alreadyWorking', 'jobPref', 'jobWherePref', 'jobRelocate'];

    quantitative_options = ['expectedEarning', 'age', 'hoursLearning', 'monthsProgramming', 'moneyForLearning', 'commuteTime', 'income'];


    componentWillMount() {
        d3.csv('./2016-FCC-New-Coders-Survey-Data.csv')
            .row((d) => fixRow(parseRow(d)))
            .get((err, data) => {
                this.setState({data: _.uniqBy(data, (d) => d.id)});
            });
    }

    pickQualitative(newKey) {
        this.setState({bucketKey: newKey});
    }

    pickQuantitative(newKey) {
        this.setState({distroKey: newKey});
    }

    render() {
        return (
            <div className="container">
                <h2>FreeCodeCamp Survey correlation explorer</h2>

                <div>
                    Choose qualitative axis
                    <Picker options={this.qualitative_options}
                            onPick={::this.pickQualitative}
                            picked={this.state.bucketKey} />
                </div>

                <div>
                    Choose quantitative axis
                    <Picker options={this.quantitative_options}
                            onPick={::this.pickQuantitative}
                            picked={this.state.distroKey} />
                </div>

                <svg width="900" height="600">
                    <Barchart x="20"
                              y="100"
                              height="500"
                              width="800"
                              data={this.state.data}
                              value={(d) => d[this.state.bucketKey]} />

                    <BucketedScatterPlot x="220"
                                         y="100"
                                         height="480"
                                         width={800-220}
                                         data={this.state.data}
                                         bucket={(d) => d[this.state.bucketKey]}
                                         value={(d) => d[this.state.distroKey]} />

                    <TopAxis data={this.state.data}
                             value={(d) => d[this.state.distroKey]}
                             maxDimension={800-220}
                             x={220}
                             y={95}
                             className="topAxis" />
                </svg>
            </div>
        );
    }
}

export default App;
