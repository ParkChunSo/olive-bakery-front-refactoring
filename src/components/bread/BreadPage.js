import React, { Component } from 'react';
import Bread from './Bread';
import SectionCarousel from './SectionCarousel';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as alertActions from "../../store/modules/alert";

class BreadPage extends React.Component{
    addAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.addAlert(message);
    };
    render() {
        return (
            <React.Fragment>
                <SectionCarousel/>
                <Bread addAlert={this.addAlert}/>
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
)(BreadPage);
