import React, { Component } from "react";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Datetime from "react-datetime";

import Button from "../common/Button.jsx";
import CustomInput from "../common/CustomInput";

import * as api from "../common/Api";
import "../../styles/scss/material-kit-react.scss";

class SalesModal extends Component{
    state ={
        date: "",
        sales: 0
    }

    handleButtonClick = () =>{
        api.saveOfflineSale(this.state.date, this.tate.sales).then(
            this.props.onClose()
        );
        
    };
    handleDateChange = (value) =>{
        if(typeof value==="string") {
            this.props.addAlert('클릭하세요');
            return null;
        }
        this.setState({
            date: value.format('YYYY-MM-DD')
        });
    };

    handleDateChange = (e) =>{
        this.setState({
            sales: e.target.value
        })
    }

    render(){
        return(
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    매출 등록
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Datetime
                            inputProps={{ placeholder: "클릭하세요", id: "datetimepicker"}}
                            dateFormat="YYYY-MM-DD"
                            timeFormat=""
                            onChange={this.handleDateChange}
                            closeOnSelect={true}
                        />
                        <p>가격</p>
                        <CustomInput 
                            labelText="price"
                            formControlProps={{
                                fullWidth: true
                            }}
                            onChange= {this.handleCustomInputChange}
                        />
                        <Button onClick={this.handleButtonClick}>추가</Button>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        )
    }
}

export default SalesModal;