import React, { Component } from "react";
import CustomTabs from "../common/CustomTabs";
import Table from "../common/Table";

import * as api from "../Api";
import ReservationModal from "../../admin-reservation/ReservationModal";
class ReservationTableForClient extends Component{
    state ={
        request: [],
        accept: [],
        complete: [],

        OpenModal: false,
        selectedItem:{},
        reservationType:""
    }

    componentDidMount(){
        this.setState({
            request: this.props.request,
            accept: this
        })
    }

    toggleTableModal = () =>{
        this.setState({
            OpenModal: !this.state.OpenModal
        })
    }

    handleClickRequest = (id) => {
        const {request} = this.state;
        const item = request.filter(request => request.reservationId === parseInt(id))[0];
        this.setState({
            selectedItem: {
                bringTime: item.bringTime,
                memberName: item.memberName,
                price: item.price,
                reservationBreads: item.reservationBreads,
                reservationId: item.reservationId,
                reservationTime: item.reservationTime
            },
            OpenModal: !this.state.OpenModal
        });
    };
    handleClickAccept = (id) => {
        const {accept} = this.state;
        const item = accept.filter(accept => accept.reservationId === parseInt(id))[0];
        this.setState({
            selectedItem: {
                bringTime: item.bringTime,
                memberName: item.memberName,
                price: item.price,
                reservationBreads: item.reservationBreads,
                reservationId: item.reservationId,
                reservationTime: item.reservationTime
            },
            OpenModal: !this.state.OpenModal
        });
    };
    handleClickComplete = (id) => {
        const {complete} = this.state;
        const item = complete.filter(complete => complete.reservationId === parseInt(id))[0];
        this.setState({
            selectedItem: {
                bringTime: item.bringTime,
                memberName: item.memberName,
                price: item.price,
                reservationBreads: item.reservationBreads,
                reservationId: item.reservationId,
                reservationTime: item.reservationTime
            },
            OpenModal: !this.state.OpenModal
        });
    };



    handleClickRequestTab = () => {
        this.setState({
            reservationType: 'REQUEST'
        });
    };
    handleClickAcceptTab = () => {
        this.setState({
            reservationType: 'ACCEPT'
        });
    };
    handleClickCompleteTab = () => {
        this.setState({
            reservationType: 'COMPLETE'
        });
    };

    render(){
        if(this.props.request === undefined)
            return null;
        
        const {request, accept, complete} = this.props;
        const r = request.map(request => (
            [request.reservationId.toString(), request.price.toString(), request.bringTime, request.reservationTime, request.checked]
        ));
        const a = accept.map(accept => (
            [accept.reservationId.toString(), accept.price.toString(), accept.bringTime, accept.reservationTime, accept.checked]
        ));
        const c = complete.map(complete => (
            [complete.reservationId.toString(), complete.price.toString(), complete.bringTime, complete.reservationTime, complete.checked]
        ));
        return(
            <div>
                <ReservationModal
                    isOpen={this.state.isOpenTable}
                    onClose={this.toggleTableModal}
                    item={this.state.selectedItem}
                    resetTable={this.postDateReservation}
                    isAdmin={false}
                    addAlert={this.props.addAlert}
                />
                <CustomTabs
                        headerColor="primary"
                        tabs={[
                            {
                                onClick: this.handleClickRequestTab,
                                tabName: '예약 중',
                                tabContent: (
                                    <React.Fragment>
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["번호", "금액", "수령시간", "예약시간"]}
                                            tableData={
                                                r
                                            }
                                            type="modal"
                                            handleClickOpen={this.handleClickRequest}
                                        />
                                    </React.Fragment>
                                )
                            },
                            {
                                onClick: this.handleClickAcceptTab,
                                tabName: '예약완료',
                                tabContent: (
                                    <React.Fragment>
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["번호", "금액", "수령시간", "예약시간"]}
                                            tableData={
                                                a
                                            }
                                            type="modal"
                                            handleClickOpen={this.handleClickAccept}
                                        />
                                    </React.Fragment>
                                )
                            },
                            {
                                onClick: this.handleClickCompleteTab,
                                tabName: '수령',
                                tabContent: (
                                    <React.Fragment>
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["번호", "금액", "수령시간", "예약시간"]}
                                            tableData={
                                                c
                                            }
                                            type="modal"
                                            handleClickOpen={this.handleClickComplete}
                                        />
                                    </React.Fragment>
                                )
                            }
                        ]}
                    />
                </div>
        )
    };
}

export default ReservationTableForClient;