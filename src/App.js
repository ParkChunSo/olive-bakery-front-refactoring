import React, { Component } from 'react';
import logo from './image/olive.png';
import Header from "./components/common/Header.jsx";
import HeaderLinks from "./components/common/HeaderLinks.jsx";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { mainListItems, secondaryListItems } from './listItems';
import {Route} from 'react-router-dom';
import {HomePage, MyPagePage, ProductsPage, SignInPage, AdminProductsPage, AdminBoardPage, AdminUsersPage, AdminReservationPage, BoardPage, AdminDashboardPage} from "./router";
import Alert from "./components/common/Alert";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import storage from "./storage";
import * as alertActions from "./store/modules/alert";
import styles from "./styles/common"

class App extends Component {
    state = {
        open: true
    };

    addAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.addAlert(message);
    };

    delAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.delAlert(message);
    };

    alert = (message, index) => {
        return (<Alert key={index} delAlert={this.delAlert} message={message}/>);
    };

    render() {
        const { classes, messages,...rest } = this.props;

        return (
            <div className="App">
                <div className={classes.root}>
                    <CssBaseline />
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classNames(classes.drawerPaper, !this.state.open),
                        }}
                        open={this.state.open}
                    >
                        <div>
                            <img src={logo} alt="logo"/>
                        </div>
                        <Divider />
                        <List>{mainListItems}</List>
                        {
                            storage.get('logged') === null ?
                            (
                                <Divider/>
                            ) :
                            (
                                <List>{secondaryListItems}</List>
                            )
                        }
                    </Drawer>

                    <main className={classes.content_app}>
                        <Header
                            absolute
                            color="transparent"
                            brand="Olive Organic Bakery"
                            rightLinks={<HeaderLinks />}
                            {...rest}
                        />
                        {
                            messages.map((msg, index) => (
                                msg===""?null:
                                this.alert(msg, index)
                            ))
                        }
                        <div>
                            <Route exact path="/" component={HomePage}/>
                            {/* <Route exact path="/products" component={ProductsPage}/> */}
                            <Route exact path="/signin" component={SignInPage}/>
                            <Route exact path="/products" component={ProductsPage}/>
                            <Route exact path="/mypage" component={MyPagePage}/>
                            <Route exact path="/board" component={BoardPage}/>
                            <Route exact path="/admin/products" component={AdminProductsPage}/>
                            <Route exact path="/admin/board" component={AdminBoardPage}/>
                                {/* <Route exact path="/admin/users" component={AdminUsersPage}/> */}
                            <Route exact path="/admin/reservation" component={AdminReservationPage}/>
                            <Route exact path="/admin" component={AdminDashboardPage}/>
                        </div>
                    </main>


                </div>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styledApp = withStyles(styles)(App);
export default connect(
    (state) => ({
        messages: state.alert.message
    }),
    (dispatch) => ({
        AlertActions: bindActionCreators(alertActions, dispatch)
    })
)(styledApp);
