import React, { Component } from 'react';
import AdminProducts from './AdminBread';
import storage from "../../storage";
import { Redirect } from 'react-router-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as alertActions from "../../store/modules/alert";

class AdminBreadPage extends React.Component{
    addAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.addAlert(message);
    };
    render() {
        return (
            <React.Fragment>
                {
                    storage.get('logged') == null
                        ?
                        (
                            <React.Fragment>
                                {this.addAlert('로그인이 필요합니다.')}
                                <Redirect to="/signin"/>
                            </React.Fragment>
                        )
                        :
                        (
                            <React.Fragment>
                                <AdminProducts addAlert={this.addAlert}/>
                            </React.Fragment>
                        )
                }
            </React.Fragment>
        );
    }
}

export default connect(
    (state) => ({
        messages: state.alert.message
    }),
    (dispatch) => ({
        AlertActions: bindActionCreators(alertActions, dispatch)
    })
)(AdminBreadPage);
