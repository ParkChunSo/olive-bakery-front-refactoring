import React, {Component} from 'react'
import {Chart} from 'react-google-charts'

class AdminChart extends Component{
    state={
        chartData: []
    }

    shouldComponentUpdate(nextProps){
        if(this.props === nextProps){
            return false;
        } else {
            return true;
        }
    }

    componentWillReceiveProps(nextProps){
        const {chartData} = nextProps;
        
        console.log(chartData);
        

        let data = [['x', '매출']];
        for(let key in chartData){
            data.push([chartData[key].date, chartData[key].totalAve])
        }
        
        this.setState({
            chartData: data
        })        
    }

     chartEvents = [
         {
            eventName: "ready",
            callback: ({ chartWrapper, google }) => {
                const chart = chartWrapper.getChart();
                google.visualization.events.addListener(chart, "select", e => {     
                    if(chart.getSelection().length !== 0){
                        const select = chart.getSelection()[0].row + 1;
                        const date = this.state.chartData[select][0].split('-');
                        if(date.length === 3)
                            this.props.callBackChart(date[0], date[1], date[2]);
                        else if(date.length === 2)
                            this.props.callBackChart(date[0], date[1], "");
                        else
                            this.props.callBackChart(date[0], "", "");
                    }
                });
            }
          
        }
    ];

    render(){
        return(
         <div>
             <Chart
                width={'100%'}
                height={'700px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={this.state.chartData}
                options={{
                    title: '매출 그래프',
                    
                    hAxis: {
                    title: '날짜',
                    },
                    vAxis: {
                    title: '매출액',
                    },
                }}
                rootProps={{ 'data-testid': '1' }}
                chartEvents={this.chartEvents}
                
                />
         </div>   
        )
    }
}

export default AdminChart;