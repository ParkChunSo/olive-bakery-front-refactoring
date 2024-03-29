import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


import Card from "../common/Card.jsx";
import CardBody from "../common/CardBody.jsx";
import CardHeader from "../common/CardHeader.jsx";
import Button from "../common/Button.jsx";

import imagesStyles from "../../styles/imagesStyles.jsx";

import { cardTitle } from "../../styles/material-kit-react.jsx";

import Face from "@material-ui/icons/Face";
import Chat from "@material-ui/icons/Chat";
import Build from "@material-ui/icons/Build";
// core components
import CustomTabs from "../common/CustomTabs.jsx"
import cardHeaderStyle from "../../styles/cardHeaderStyle";
import ShoppingCart from "./ShoppingCart";
import BreadModal from "./BreadModal";

import {connect} from 'react-redux';

import { bindActionCreators } from "redux";
import * as cartActions from "../../store/modules/cart";
import CardActionArea from "@material-ui/core/es/CardActionArea/CardActionArea";
import {Animate} from 'react-move';
import {easeExpOut} from 'd3-ease';
import ReactDom from "react-dom";
import axios from "axios";
import Pulse from 'react-reveal/Pulse';
import CustomStyle from "../../styles/common"

import CardFooter from "../common/CardFooter.jsx";

class Bread extends React.Component {
    state = {
        bread: [],
        MON: [],
        TUE: [],
        WED: [],
        THU: [],
        FRI: [],
        SAT: [],
        SUN: [],
        isOpen: false,
        selectedItem: {}
    };
    dayTypes = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    componentDidMount() {
        this.getBread();
        this.dayTypes.map(day => (
            this.getDayBread(day)
        ));
    }

    handleAddItem = (e) => {
        const { CartActions } = this.props;
        const { bread } = this.state;
        let item = bread.filter(bread => bread.name === e.currentTarget.value)[0];
        //console.log(e.target.getAttribute());
        console.log(e.currentTarget.value);
        console.log(item);
        item = {...item, count: 1};
        if(item.length !== null)
            CartActions.addItem(item);
    };
    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };
    handleClickOpen = (name) => {
        axios.get(`http://15.164.57.47:8080/olive/bread/name/${name}`, {
            headers: { 'Content-type': 'application/json', },
        }).then(response => {
            //this.props.onReceive(response.data.number);
            console.log(response.data);
            this.setState({
                selectedItem: response.data
            });
            this.toggleModal();
        });
    };

    handlePulse = (name) => {
        console.log(name);
        this.setState({
            bread: this.state.bread.map(bread=> (bread.name===name?{count: bread.count+1, ...bread}:bread))
        });
    };

    getDayBread = (day) => {
        axios.get(`http://15.164.57.47:8080/olive/bread/day/${day}`
        ).then(response => {
            //this.props.onReceive(response.data.number);
            if(response.status===200) {
                console.log('알림창 추가하자');
                this.setState({
                    [day]: response.data.filter(data=> data.isSoldOut===false)
                });
            }
        });
    };

    getBread = () => {
        axios.get(`http://15.164.57.47:8080/olive/bread`
        ).then(response => {
            //this.props.onReceive(response.data.number);
            if(response.status===200) {
                console.log('알림창 추가하자');
                let b = response.data.filter(data=> data.isSoldOut===false);
                this.setState({
                    bread: b.map(bread => ({count: 1, ...bread}))
                });
            }
        });
    };

    render() {
        const {classes} = this.props;
        const { bread, MON, TUE, WED, THU, FRI, SAT, SUN } = this.state;
        const {
            handleAddItem
        } = this;
        const days = ['ALL', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        const breads = {ALL: bread, MON: MON, TUE: TUE, WED: WED, THU: THU, FRI: FRI, SAT: SAT, SUN: SUN};
        const recommend = bread.filter(b => b.state === "RECOMMEND");
        let tabs = days.map(day => (
            {
                tabName: day,
                tabIcon: Face,
                tabContent: (
                    <div className={classNames(classes.layout, classes.cardGrid)}>
                        {/* End hero unit */}
                        <Grid container spacing={40}>
                            {breads[day].map(bread => (
                                <Grid item key={bread.name} sm={6} md={4} lg={4}>
                                    <Card className={classes.card} onMouseOver={()=>this.handlePulse(bread.name)}>
                                        <CardActionArea onClick={() => this.handleClickOpen(bread.name)}>
                                            <Pulse spy={this.state.bread.filter(b=>b.name===bread.name)[0]}>
                                                <img
                                                    style={{
                                                        height: "180px",
                                                        width: "100%",
                                                        display: "block"
                                                    }}
                                                    className={classes.imgCardTop}
                                                    src={bread.imageUrl}
                                                    alt="Card-img-cap"
                                                />

                                                <CardBody className={classes.cardContent}>
                                                    <h4 className={classes.cardTitle}>{bread.name}</h4>
                                                    <p>{bread.description}</p>
                                                    <p>{bread.price}</p>
                                                </CardBody>
                                            </Pulse>
                                        </CardActionArea>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button color="primary" value={bread.name} onClick={handleAddItem}>장바구니 담기</Button>
                                        </CardFooter>

                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                )}
        ));
        return (
            <React.Fragment>
                <BreadModal
                    isOpen={this.state.isOpen}
                    onClose={this.toggleModal}
                    item={this.state.selectedItem}
                    addItem={this.handleAddItem}
                    isAdmin={false}
                    addAlert={this.props.addAlert}
                />
                <CssBaseline/>
                <main>
                    <div>
                        <div className={classes.content}>
                            <Card>
                                <CardHeader color="primary">
                                    <h4 className={classes.cardTitleWhite}>추천 상품</h4>
                                    <p className={classes.cardCategoryWhite}>
                                        추천 상품입니다.
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <div className={classNames(classes.layout, classes.cardGrid)}>
                                        {/* End hero unit */}
                                        <Grid container spacing={40}>
                                            {recommend.map(bread => (
                                                <Grid item key={bread.name} sm={6} md={4} lg={4}>
                                                    <Card className={classes.card} onMouseOver={()=>this.handlePulse(bread.name)}>
                                                        <CardActionArea onClick={() => this.handleClickOpen(bread.name)}>
                                                            <Pulse spy={this.state.bread.filter(b=>b.name===bread.name)[0]}>
                                                                <img
                                                                    style={{
                                                                        height: "180px",
                                                                        width: "100%",
                                                                        display: "block"
                                                                    }}
                                                                    className={classes.imgCardTop}
                                                                    src={bread.imageUrl}
                                                                    alt="Card-img-cap"
                                                                />
                                                                <CardBody className={classes.cardContent}>
                                                                    <h4 className={classes.cardTitle}>{bread.name}</h4>
                                                                    <p>{bread.description}</p>
                                                                    <p>{bread.price}</p>
                                                                </CardBody>
                                                            </Pulse>
                                                        </CardActionArea>
                                                        <CardFooter className={classes.cardFooter}>
                                                            <Button color="primary" value={bread.name} onClick={handleAddItem}>장바구니 담기</Button>
                                                        </CardFooter>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>

                        <div className={classes.content}>
                            <CustomTabs
                                headerColor="primary"
                                tabs={tabs}
                            />
                        </div>
                    </div>
                </main>
            </React.Fragment>
        );
    }
}

Bread.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styledProducts = withStyles(CustomStyle)(Bread);
export default styledProducts;
