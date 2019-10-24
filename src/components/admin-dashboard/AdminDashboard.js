import React, {Component} from 'react';

import AdminChart from "./AdminChart"
import AdminReservation from "./AdminReservation"
import SelectDateBar from './SelectDateBar';
import SalesModal from './SalesModal';
import Button from '../common/Button';
import CustomStyle from '../../styles/common';
import withStyles from "@material-ui/core/styles/withStyles";


import * as api from "../common/Api"
 

class AdminDashboard extends Component{
    state={
        reservatoinSelectDate: "",
        reservationData: [],
        selectedItem: {},
        modalOpen: false,
        selectedYear: 2019,
        selectedMonth: 10,
        selectedDay: 1,
        detailsSalesData: [],
        graphData: [],
        isOpenSalesModal: false
    };

    componentWillReceiveProps(nextProps){
        console.log("Props 데이터 변경")
        this.setState({
            selectedYear: nextProps.todayYear,
            selectedMonth: nextProps.todayMonth,
            reservatoinSelectDate : nextProps.today,
            reservationData: nextProps.monthReservationData,
            graphData: nextProps.firstGraphData,
            detailsSalesData: nextProps.firstDetailsSalesData
        })
    }

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
    };

    handleItemChange = (event) =>{
        const selectedDay = event.target.value;

        this.setState({
            selectedDay: selectedDay,
            reservatoinSelectDate: this.convertDate2String(this.state.selectedYear, this.state.selectedMonth, selectedDay)
        });

        this.getReservationDataByDate(this.convertDate2String(this.state.selectedYear, this.state.selectedMonth, selectedDay))
    };

    toggleSalesModal = () =>{
        this.setState({
            isOpenSalesModal: !this.state.isOpenSalesModal
        });
        this.getChartDataByYearAndMonth(this.state.selectedYear, this.state.selectedMonth);
    };

    getReservationDataByDate = (selectDate) =>{
        api.getReservationDataByDate(selectDate).then(response =>{
            this.setState({
                reservationData: response.data === undefined ? [] : response.data
            });
        });
    };

    getReservationDataByRange = (startDate, endDate) =>{
        console.log("getReservationDataByRange");

        api.getReservationDataByRange(startDate, endDate).then(response =>{
            this.setState({
                reservationData: response.data
            });
        })
    };

    getChartData = () =>{
        api.getGraphData().then(response =>{
            const tmpGraph = response.data.map(data => ({date: data.date[0].toString(), totalAve: data.totalAve}));
            const tmpDetails = response.data.map(data => ({date: data.date[0], totalAve: data.totalAve, byTypes: data.byTypes}));
            this.setState({
                graphData: tmpGraph,
                detailsSalesData: tmpDetails
            })
        });
    };

    getChartDataByYear = async (year) =>{
        api.getGraphDataByYear(year).then(response =>{
            this.setState({
                graphData: response.data.map(data => ({date: data.date[0].toString() + '-' + data.date[1].toString(), totalAve: data.totalAve})),
                detailsSalesData: response.data.map(data => ({date: data.date[0], totalAve: data.totalAve, byTypes: data.byTypes}))
            })
        });
    };

    getChartDataByYearAndMonth = (year, month) =>{
        api.getGraphDataByYearAndMonth(year, month).then(response =>{
            this.setState({
                graphData: response.data === "" ? [] : response.data.map(data => ({date: data.date[0].toString() + '-' + data.date[1].toString() +'-'+ data.date[2].toString(), totalAve: data.totalAve})),
                detailsSalesData: response.data === "" ? [] : response.data.map(data => ({date: data.date[0], totalAve: data.totalAve, byTypes: data.byTypes}))
            })
        });
    };

    callBackSelectBar = (selectedYear, selectedMonth) =>{
        this.setState({
            selectedYear: selectedYear,
            selectedMonth: selectedMonth
        });

        console.log(selectedMonth);

        if(selectedYear === 0 || selectedYear === ""){
            this.getChartData();
        }else if(selectedMonth === 0 || selectedMonth === ""){
            this.getChartDataByYear(selectedYear);
        }else{
            this.getChartDataByYearAndMonth(selectedYear, selectedMonth);
        }
        this.callBackChart(selectedYear, selectedMonth, "");
    }

    callBackChart = (year, month, day) => {
        console.log(String(year) +"-"+ String(month) +"-"+ String(day));
        
        let startDate = "", endDate = "";
        if(month === ""){
            startDate = this.convertDate2String(year, 1, 1);
            endDate = this.convertDate2String(year, 12, 31);
        }else if(day === ""){
            startDate = this.convertDate2String(year, month, 1);
            endDate = this.convertDate2String(year, month, 31);
        }else{
            startDate = this.convertDate2String(year, month, day);
            this.getReservationDataByDate(startDate);
            return;
        }
        this.getReservationDataByRange(startDate, endDate);
    };


    render(){
        console.log("render");
        const {reservationData, selectedYear, selectedMonth} = this.state;
        const {classes} = this.props;
        return (
            <React.Fragment>
                <SalesModal
                        isOpen = {this.state.isOpenSalesModal}
                        onClose = {this.toggleSalesModal}
                    />
                <div>
                    <div className={classes.chart_div}>
                        <div>
                            <div>
                                <SelectDateBar
                                    selectedYear={selectedYear}
                                    selectedMonth = {selectedMonth}
                                    callBack= {this.callBackSelectBar}
                                />
                            </div>
                            <div>
                                <Button onClick = {this.toggleSalesModal}>매출 등록 넣기</Button>
                            </div>
                        </div>

                        <div>
                            <AdminChart
                                chartData= {this.state.graphData}
                                callBackChart = {this.callBackChart}
                            />
                        </div>
                    </div>
                    <React.Fragment>
                        <div className= {classes.left_wrapper}>
                            <AdminReservation
                                reservationData={reservationData}
                            />
                        </div>

                        <div className= {classes.right_wrapper}>
                            <p>aaaa</p>
                        </div>
                    </React.Fragment>
                </div>
            </React.Fragment>
        )
    };

}
export default withStyles(CustomStyle)(AdminDashboard);

