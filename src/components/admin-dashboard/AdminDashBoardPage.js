import React, { Component } from "react";
import AdminDashboard from "./AdminDashboard";
import * as api from "../common/Api"

class AdminDashBoardPage extends Component{
    state = {
        selectedYear: 0,
        selectedMonth: 0,
        reservatoinSelectDate : "",
        reservationData: [],
        graphData: [],
        detailsSalesData: []
    }
    componentWillMount(){
        const today = new Date();
        const date = this.convertDate2String(today.getFullYear(), (today.getMonth() + 1), today.getDate());
        const startDate = this.convertDate2String(today.getFullYear(), (today.getMonth() + 1), 1);
        const endDate = this.convertDate2String(today.getFullYear(), (today.getMonth() + 1), 31);
        this.getReservationDataByRange(startDate, endDate);
        this.getChartDataByYearAndMonth(today.getFullYear(), (today.getMonth() + 1));
        this.setState({ 
            selectedYear: today.getFullYear(),
            selectedMonth: (today.getMonth() + 1),
            reservatoinSelectDate: date 
            
        });
    }

    getReservationDataByRange = (startDate, endDate) =>{
        console.log("getReservationDataByRange");
        
        api.getReservationDataByRange(startDate, endDate).then(response =>{
            this.setState({
                reservationData: response.data
            })
        })
    }

    getChartDataByYearAndMonth = (year, month) =>{
        api.getGraphDataByYearAndMonth(year, month).then(response =>{
            this.setState({
                graphData: response.data === "" ? [] : response.data.map(data => ({date: data.date[0].toString() + '-' + data.date[1].toString() +'-'+ data.date[2].toString(), totalAve: data.totalAve})),
                detailsSalesData: response.data === "" ? [] : response.data.map(data => ({date: data.date[0], totalAve: data.totalAve, byTypes: data.byTypes}))
            })
        });
    };
    convertDate2String = (year, month, day) =>{
        let date = year.toString();
        if(month < 10){
            date +=  ('-0' + month);
        }else{
            date += ('-' + month);
        }

        if(day < 10){
            date +=  ('-0' + day);
        }else{
            date += ('-' + day);
        }

        return date;
    }

    render(){
        return(
            <AdminDashboard
                todayYear= {this.state.selectedYear}
                todayMonth= {this.state.selectedMonth}
                today = {this.state.reservatoinSelectDate}
                monthReservationData={this.state.reservationData}
                firstGraphData= {this.state.graphData}
                firstDetailsSalesData= {this.state.detailsSalesData}
            />
        )
    }
}

export default AdminDashBoardPage;