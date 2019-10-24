import React from "react";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Card from "../common/Card.jsx";
import CardBody from "../common/CardBody.jsx";
import Button from "../common/Button.jsx";

import storage from "../../storage";

import imagesStyles from "../../styles/imagesStyles.jsx";

import { cardTitle } from "../../styles/material-kit-react.jsx";
import "../../styles/scss/material-kit-react.scss"
import Datetime, {Moment} from "react-datetime";
import * as api from "../common/Api"
import CardFooter from "../common/CardFooter.jsx";
import CustomStyle from "../../styles/common"
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline";
import Cancel from "@material-ui/icons/CancelOutlined"

const style = {
    ...imagesStyles,
    cardTitle,
    ...CustomStyle
};


class ShoppingCart extends React.Component {
    state = {
        datetime: "",
        dayValid: 0,
        timeValid: 0,
        timeIsValid: false
    };

    handleIncrement = (e) => {
        const { CartActions } = this.props;
        CartActions.increment(e.currentTarget.value);
    };
    handleDecrement = (e) => {
        const { CartActions } = this.props;
        CartActions.decrement(e.currentTarget.value);
    };
    handleDelItem = (e) => {
        const { CartActions } = this.props;
        CartActions.delItem(e.currentTarget.value);
    };
    postReservation = () => {
        const {timeValid, dayValid, datetime} = this.state;

        if(timeValid<1000 || timeValid>2000 ){
            console.log(timeValid);
            this.props.addAlert('빵 수령시간이 잘못되었습니다. 수령시간은 10시-20시입니다');
            return null;
        }

        this.email = storage.get('email');
        const {itemlist} = this.props;
        let response = api.saveReservation(itemlist.map(item => ({"breadCount": item.count, "breadName": item.name})),
            datetime, this.email);
        response.then(response => {
            if(response.status===200) {
                this.props.addAlert('예약 완료');
            }
        });
    };

    handleDateChange = (value) => {
        if(typeof value==="string") {
            this.props.addAlert('클릭하세요');
            return null;
        }
        let date = value.format('YYYY-MM-DD HH:mm');
        let day = parseInt(date.substring(5,7));
        let hour = date.substring(11,13);
        let min = date.substring(14,16);
        let time = parseInt(hour + min);

        this.setState({
            datetime: date,
            dayValid: day,
            timeValid: time,
            timeIsValid: false
        });
    };

    yesterday = Datetime.moment().subtract(1, 'day');
    isValid = (current) => {
        return current.isAfter(this.yesterday);
    };
    render() {
        const { classes, itemlist, tot } = this.props;
        const { handleIncrement, handleDecrement, handleDelItem} = this;
        return (
            <Card style={{width: "15%", height:"80%",position:"fixed", overflowY:'auto', overflowX:'hidden'}}>

                <CardBody>
                    <h4 className={classes.cardTitle}>장바구니</h4>
                    <p>원하는 갯수만큼 추가하세요</p>
                    {
                        itemlist.map(item =>
                            <p key={item.name}>{item.name}({item.price*item.count}원)<br/>
                                <Button color="primary" justIcon simple value={item.name} onClick={handleIncrement}>
                                    <AddCircleOutline/>
                                </Button>
                                {item.count}
                                <Button color="primary" justIcon simple value={item.name} onClick={handleDecrement}>
                                    <RemoveCircleOutline/>
                                </Button>
                                <Button color="primary" justIcon simple value={item.name} onClick={handleDelItem}>
                                    <Cancel/>
                                </Button>
                            </p>
                        )
                    }
                    <p>
                        total: {tot}
                    </p>
                    <Datetime
                        inputProps={{ placeholder: "클릭하세요", id: "datetimepicker"}}
                        isValidDate={this.isValid}
                        dateFormat="YYYY-MM-DD"
                        timeFormat="HH:mm"
                        onChange={this.handleDateChange}
                    />
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                    <Button color="primary" onClick={this.postReservation}>
                        예약하기
                    </Button>
                </CardFooter>
            </Card>
        );
    }
}

export default withStyles(style)(ShoppingCart);
