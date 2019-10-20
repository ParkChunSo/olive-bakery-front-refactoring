import React from 'react';
import Button from "../common/Button.jsx";
import Card from "../common/Card";
import CardBody from "../common/CardBody";
import CardHeader from "../common/CardHeader";
import CardFooter from "../common/CardFooter";
import withStyles from "@material-ui/core/styles/withStyles";
import CustomTabs from "../common/CustomTabs";
import Table from "../common/Table";

import ReservationModal from "./ReservationModal";
import MyPageModal from "./MyPageModal";
import Profile from "../common/Profile";
import CustomStyle from "../../styles/common"
import * as api from "../common/Api";

const styles = CustomStyle;


class MyPage extends React.Component {
    state = {
        request: [],
        accept: [],
        complete: [],
        selectedItem: null,
        isOpenForm: false,
        isOpenTable: false,
        reservationType: 'REQUEST',
        userData: {}
    };

    componentDidMount() {
        this.getReservation();
        this.getUserData();
    }

    getReservation = () => {
        api.getReservationDataByUser("REQUEST").then(response =>{
            this.setState({
                request: response.data
            })
        });
        api.getReservationDataByUser("ACCEPT").then(response =>{
            this.setState({
                accept: response.data
            })
        });
        api.getReservationDataByUser("COMPLETE").then(response =>{
            this.setState({
                complete: response.data
            })
        });
    };

    getUserData = () => {
        api.getUserData().then(response =>{
            this.setState({
                userData: response.data
            })
        });
    }

    toggleFormModal = () => {
        this.setState({
            isOpenForm: !this.state.isOpenForm
        });
    };

    toggleTableModal = () => {
        this.setState({
            isOpenTable: !this.state.isOpenTable
        });
    };

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
            }
        });
        this.toggleTableModal();
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
            }
        });
        this.toggleTableModal();
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
            }
        });
        this.toggleTableModal();
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

    render() {
        const { classes } = this.props;
        const { request, accept, complete } = this.state;
        const {userData} = this.state;

        const r = request.map(request => (
            [request.reservationId.toString(), request.price.toString(), request.bringTime, request.reservationTime]
        ));
        const a = accept.map(accept => (
            [accept.reservationId.toString(), accept.price.toString(), accept.bringTime, accept.reservationTime]
        ));
        const c = complete.map(complete => (
            [complete.reservationId.toString(), complete.price.toString(), complete.bringTime, complete.reservationTime]
        ));
        return (
            <React.Fragment>
                <ReservationModal
                    isOpen={this.state.isOpenTable}
                    onClose={this.toggleTableModal}
                    item={this.state.selectedItem}
                    isAdmin={false}
                    resetTable={this.getReservation}
                    type={this.state.reservationType}
                    addAlert={this.props.addAlert}
                />
                <MyPageModal
                    isOpen={this.state.isOpenForm}
                    onClose={this.toggleFormModal}
                    addAlert={this.props.addAlert}
                    userData= {userData}
                />
                <Card>
                    <CardHeader color="primary">
                        <h4 className={classes.cardTitleWhite}>프로필</h4>
                        <p className={classes.cardCategoryWhite}>
                            프로필 수정하시겠어요?
                        </p>
                    </CardHeader>
                    <CardBody>
                        <Profile userData={userData} />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                        <Button color="primary" onClick={this.toggleFormModal} simple size="lg">
                            프로필 수정
                        </Button>
                    </CardFooter>
                </Card>
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
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(MyPage);
