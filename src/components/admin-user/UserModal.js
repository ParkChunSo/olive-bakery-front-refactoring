import React from 'react';

import Button from "../common/Button.jsx";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Profile from '../common/Profile.js';


class UserModal extends React.Component {
    state = {
        confirmPassword: "",
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    handleFigureUserOut = () => {
        this.props.onClose();
    };

    render() {
        const {user} = this.props;
        if(this.props.isOpen===false)
            return null;
        return (
                <Dialog
                    open={this.props.isOpen}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">{user.name} 님의 회원정보입니다.</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Profile
                                userData = {user}
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={this.handleFigureUserOut} simple size="lg">
                            자세히 보기
                        </Button>
                        <Button onClick={this.props.onClose} color="rose" simple size="lg">
                            닫기
                        </Button>
                    </DialogActions>
                </Dialog>
        );
    }
}

export default UserModal;
