import React, { Component } from "react";
import Board from "./Board";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as alertActions from "../../store/modules/alert";
class BoardPage extends Component{
    addAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.addAlert(message);
    };
    render(){
        return(
            <div>
                <Board
                    addAlert={this.addAlert}
                />
            </div>
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
)(BoardPage);