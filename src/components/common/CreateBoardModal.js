import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from "@material-ui/core/InputAdornment";
import People from "@material-ui/icons/People";
import Lock from "@material-ui/icons/LockOutlined";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
import TextField from '@material-ui/core/TextField';

import Button from "./Button.jsx";
import CustomInput from "./CustomInput.jsx";

import withStyles from "@material-ui/core/styles/withStyles";
import checkStyles from "../../styles/customCheckboxRadioSwitch";
import customStyles from "../../styles/common";
import * as api from "./Api";

const styles = {...customStyles, ...checkStyles};

class CreateBoardModal extends React.Component {
    state = {
        title: "",
        context: "",
        isNotice: false,
        isSecret: false
    };

    handleChange = (e) => {
        console.log(e.target.id);
        
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    postBoard = () => {
        api.savePost("BOARD", this.state.title, this.state.context, this.state.isSecret, this.state.isNotice).then(response => {
            this.props.addAlert('게시물 추가완료');
            this.props.resetTable('board', 1);
            this.resetBoard();
            this.props.onClose();
        });
    };

    postQna = () => {
        api.savePost("QUESTION", this.state.title, this.state.context, this.state.isSecret, this.state.isNotice).then(response => {
            this.props.addAlert('QnA 추가완료');
            this.props.resetTable('qna', 1);
            this.resetBoard();
            this.props.onClose();
        });
    };

    handleChangeCheckbox = (e) => {
        if(e.target.checked){
            this.setState({
                [e.target.id]: true
            });
        }
        else{
            this.setState({
                [e.target.id]: false
            });
        }
    };

    resetBoard = () => {
        this.setState({
            title: "",
            context: "",
            isNotice: false,
            isSecret: false
        });
    };

    render() {
        const {isAdmin, classes, type} = this.props;
        if(this.props.isOpen===false)
            return null;
        return (
            <React.Fragment>
                <Dialog
                    open={this.props.isOpen}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">게시물/QnA 추가</DialogTitle>
                    <DialogContent>
                        {
                            isAdmin === false
                                ?
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="isSecret"
                                            onChange={this.handleChangeCheckbox}
                                            checked={this.state.isSecret===true}
                                            checkedIcon={<Check className={classes.checkedIcon} />}
                                            icon={<Check className={classes.uncheckedIcon} />}
                                            classes={{ checked: classes.checked }}
                                        />
                                    }
                                    classes={{ label: classes.label }}
                                    label="isSecret"
                                />
                                :
                                <React.Fragment>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="isNotice"
                                                onChange={this.handleChangeCheckbox}
                                                checked={this.state.isNotice===true}
                                                checkedIcon={<Check className={classes.checkedIcon} />}
                                                icon={<Check className={classes.uncheckedIcon} />}
                                                classes={{ checked: classes.checked }}
                                            />
                                        }
                                        classes={{ label: classes.label }}
                                        label="isNotice"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="isSecret"
                                                checked={this.state.isSecret===true}
                                                onChange={this.handleChangeCheckbox}
                                                checkedIcon={<Check className={classes.checkedIcon} />}
                                                icon={<Check className={classes.uncheckedIcon} />}
                                                classes={{ checked: classes.checked }}
                                            />
                                        }
                                        classes={{ label: classes.label }}
                                        label="isSecret"
                                    />
                                </React.Fragment>
                        }
                        <CustomInput
                            labelText="제목"
                            id="title"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "string",
                                value: this.state.title,
                                onChange: this.handleChange,
                                required: true,
                            }}
                        />
                         <TextField
                            id="context"
                            label="내용"
                            multiline
                            rows="7"
                            fullWidth
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            onChange= {this.handleChange}
                        />
                    </DialogContent>
                    {
                        isAdmin===true
                        ?
                            <DialogActions>
                                <Button onClick={this.props.onClose} color="rose" simple size="lg">
                                    취소
                                </Button>
                                <Button onClick={this.resetBoard} color="info" simple size="lg">
                                    초기화
                                </Button>
                                <Button color="primary" onClick={this.postBoard} simple size="lg">
                                    게시물 추가
                                </Button>
                                <Button color="primary" onClick={this.postQna} simple size="lg">
                                    Q&A 추가
                                </Button>
                            </DialogActions>
                        :
                            (
                                type==='board'
                                ?
                                    <DialogActions>
                                        <Button onClick={this.props.onClose} color="rose" simple size="lg">
                                            취소
                                        </Button>
                                        <Button onClick={this.resetBoard} color="info" simple size="lg">
                                            초기화
                                        </Button>
                                        <Button color="primary" onClick={this.postBoard} simple size="lg">
                                            게시물 추가
                                        </Button>
                                    </DialogActions>
                                :
                                    <DialogActions>
                                        <Button onClick={this.props.onClose} color="rose" simple size="lg">
                                            취소
                                        </Button>
                                        <Button onClick={this.resetBoard} color="info" simple size="lg">
                                            초기화
                                        </Button>
                                        <Button color="primary" onClick={this.postQna} simple size="lg">
                                            Q&A 추가
                                        </Button>
                                    </DialogActions>
                            )
                    }
                </Dialog>
            </React.Fragment>
        );
    }
}

export default  withStyles(styles)(CreateBoardModal);
