import React from 'react';
import BackgroundImg from '../../BackgroundImg?v=0';
import Contents from '../../Contents?v=0';
import Contents2 from '../../Contents2?v=0';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as alertActions from "../../store/modules/alert";
import * as api from "../common/Api"

class HomePage extends React.Component{
    componentDidMount() {
        this.getNotice();
    }
    getNotice = () => {
        let notice = '';
        let response = api.getNotice();
        response.then(response => {
            if(response.status===200) {
                response.data.map((d, index)=> (
                    notice = notice + (index + 1).toString() + '번째 공지사항\n' + d.context+'\n\n'
                ));
                console.log(notice);
                this.addAlert(notice);
            }
        });
    };
    addAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.addAlert(message);
    };
    render()
    {
        return (
            <div className='home'>
                <BackgroundImg/>
                <div>
                    <Contents/>
                    <Contents2/>
                </div>
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
)(HomePage);
