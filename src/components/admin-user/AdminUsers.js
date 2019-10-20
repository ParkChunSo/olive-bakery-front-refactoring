import React from 'react';

import axios from "axios";

import Button from "../common/Button.jsx";
import CustomTabs from "../common/CustomTabs";
import Table from "../common/Table";
import UserModal from "./UserModal";

import withStyles from "@material-ui/core/styles/withStyles";
import checkStyles from "../../styles/customCheckboxRadioSwitch";
import customStyles from "../../styles/common";

import * as api from "../common/Api"

const styles = {...customStyles, ...checkStyles};

class AdminUsers extends React.Component {
    state = {
        users: [],
        isOpen: false,
        selectedUser: null,
        checkedList: [],
        isAllCheck: false
    };

    componentDidMount() {
        this.getUsers();
    }

    getUsers = () => {
        api.getUsers().then(response =>{
            this.setState({
                users: response.data.map(data=>({...data, checked:'false'}))
            });
        });
    };

    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    handleClickOpen = (id) => {
        const {users} = this.state;
        const item = users.filter(user => user.id === id)[0];
        this.setState({
            selectedUser: item,
            isOpen: !this.state.isOpen
        });
    };

    handleChangeCheckbox = (e) => {
        console.log(this.state.checkedList);
        if(e.target.checked){
            if(e.target.id==='isAllCheck')
                this.setState({
                    isAllCheck : true,
                    users: this.state.users.map(
                        user =>
                            ({...user, checked: 'true'})
                    ),
                    checkedList: this.state.users.map(user=> user)
                });
            else {
                this.setState({
                    checkedList: this.state.checkedList.concat(this.state.users.filter(user => user.id === e.target.id)[0]),
                    users: this.state.users.map(
                        user => user.id === e.target.id
                            ?
                            ({...user, checked: 'true'})
                            :
                            user
                    )
                });
            }
        }
        else{
            if(e.target.id==='isAllCheck')
                this.setState({
                    isAllCheck : false,
                    users: this.state.users.map(
                        user =>
                            ({...user, checked: 'false'})
                    ),
                    checkedList: []
                });
            else
                this.setState({
                    checkedList: this.state.checkedList.filter(user => user.id!==e.target.id),
                    users: this.state.users.map(
                        user => user.id===e.target.id
                            ?
                            ({...user, checked: 'false'})
                            :
                            user
                    )
                });
        }
    };

    render() {
        const { classes } = this.props;
        const { users } = this.state;
        const u = users.map(user => (
            [user.id, user.name, user.phoneNumber, user.checked]
        ));
        return (
            <div>
                <UserModal
                    isOpen={this.state.isOpen}
                    onClose={this.toggleModal}
                    user={this.state.selectedUser}
                />
                <CustomTabs
                    headerColor="primary"
                    tabs={[
                        {
                            tabName: '유저들',
                            tabContent: (
                                <React.Fragment>
                                    <Table
                                        tableHeaderColor="primary"
                                        tableHead={["이메일", "이름", "전화번호"]}
                                        tableData={
                                            u
                                        }
                                        type="modal"
                                        isAdmin={true}
                                        handleClickOpen={this.handleClickOpen}
                                        handleChangeCheckbox={this.handleChangeCheckbox}
                                        isAllCheck={this.state.isAllCheck}
                                    />
                                    <Button color="rose" onClick={this.toggleStateModal} simple size="lg">
                                        유저 삭제
                                    </Button>
                                    <Button color="primary" onClick={this.toggleStateModal} simple size="lg">
                                        관리자로 변경
                                    </Button>
                                    <Button color="info" onClick={this.toggleStateModal} simple size="lg">
                                        관리자 권한 해제
                                    </Button>
                                </React.Fragment>
                            )
                        }
                    ]}
                />
            </div>
        );
    }
}

export default withStyles(styles)(AdminUsers);
