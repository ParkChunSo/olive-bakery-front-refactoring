import React, { Component } from 'react';
import Bread from './Bread';
import SectionCarousel from './SectionCarousel';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as alertActions from "../../store/modules/alert";
import * as cartActions from "../../store/modules/cart";
import ShoppingCart from "./ShoppingCart";
import {withStyles} from "@material-ui/core";
import CustomStyle from "../../styles/common";


class BreadPage extends React.Component{
    addAlert = (message) => {
        const { AlertActions } = this.props;
        AlertActions.addAlert(message);
    };
    render() {
        const {CartActions, classes, itemlist, tot} = this.props;
        return (
            <React.Fragment>
                <div className={classes.right}>
                    <ShoppingCart
                        itemlist={itemlist}
                        tot={tot}
                        CartActions={CartActions}
                        addAlert={this.addAlert}
                    />
                </div>
                <SectionCarousel/>

                <Bread
                    addAlert={this.addAlert}
                    CartActions={CartActions}
                />

            </React.Fragment>
        );
    }
}

const styledBreadPage = withStyles(CustomStyle)(BreadPage);

export default connect(
    (state) => ({
        messages: state.alert.message,
        itemlist: state.cart.itemlist,
        tot: state.cart.tot
    }),
    (dispatch) => ({
        AlertActions: bindActionCreators(alertActions, dispatch),
        CartActions: bindActionCreators(cartActions, dispatch)
    })
)(styledBreadPage);
