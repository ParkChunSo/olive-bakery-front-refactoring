import React from 'react';
import CustomInput from "../common/CustomInput.jsx";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "../common/Button.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import Lock from "@material-ui/icons/LockOutlined";
import Phone from "@material-ui/icons/Phone";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import checkStyles from "../../styles/customCheckboxRadioSwitch";
import Radio from "@material-ui/core/Radio";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord"
import CustomDropdown from "../common/CustomDropdown"
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import * as api from "../common/Api"

class SignUpForm extends React.Component {
    state = {
        open: false,
        password: "",
        confirmPassword: "",
        name: "",
        email: "",
        phoneNumber: "",
        age: "20",
        male: "Man",
        buttonText: "나이"
    };

    genderState = ['Man', 'Woman'];

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChangeGenderState = (e) => {
        console.log(this.state.male==="Man");
        this.setState({
            male: this.genderState.filter(state => state===e.target.id)[0]
        });
    };

    handleChangeAge = (age) => {
        console.log(age);
        this.setState({
            buttonText: age,
            age: age
        });
    };

    postSignUp = () => {
        let response = api.signUpClient(
            {
                "id": this.state.email,
                "name": this.state.name,
                "phoneNumber": this.state.phoneNumber,
                "pw": this.state.password,
                "age": this.state.age,
                "male": this.state.male==="Man"
            }
        );
        response.then(response => {
            console.log(response);
            if(response.status===200){
                this.props.addAlert('회원가입이 완료되었습니다');
                this.setState({
                   open: false 
                });
            }
        });
    };

    render() {
        const {classes} = this.props;
        const wrapperDiv = classNames(
            classes.checkboxAndRadio,
            classes.checkboxAndRadioHorizontal
        );
        return (
            <React.Fragment>
                <Button simple color="success" size="lg" onClick={this.handleClickOpen}>
                    회원가입
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">회원가입</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            올리브영 베이커리의 회원이 되시면.......뭐라하지 흠
                        </DialogContentText>
                        <CustomInput
                            labelText="E-mail"
                            id="email"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "email",
                                onChange: this.handleChange,
                                required: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Email /*className={classes.inputIconsColor}*//>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <CustomInput
                            labelText="Name"
                            id="name"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                                onChange: this.handleChange,
                                required: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <People /*className={classes.inputIconsColor}*//>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <CustomDropdown
                            buttonText={this.state.buttonText}
                            dropdownList={[
                                "10",
                                "20",
                                "30",
                                "40",
                                "50",
                            ]}
                            onClick = {this.handleChangeAge}
                        />
                        {
                            this.genderState.map((state, index) => (
                                <React.Fragment key={index}>
                                    <div className={wrapperDiv}>
                                        <FormControlLabel
                                            control={
                                                <Radio
                                                    onChange={this.handleChangeGenderState}
                                                    checked={this.state.male===state}
                                                    value={state}
                                                    id={state}
                                                    icon={
                                                        <FiberManualRecord
                                                            className={classes.radioUnchecked}
                                                        />
                                                    }
                                                    checkedIcon={
                                                        <FiberManualRecord className={classes.radioChecked} />
                                                    }
                                                    classes={{
                                                        checked: classes.radio
                                                    }}
                                                />
                                            }
                                            classes={{ label: classes.label }}
                                            label={state}
                                        />
                                    </div>
                                </React.Fragment>
                            ))
                        }
                        <CustomInput
                            labelText="Phone Number"
                            id="phoneNumber"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                                onChange: this.handleChange,
                                required: true,
                                placeholder: "01012341234",
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Phone /*className={classes.inputIconsColor}*/ />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <CustomInput
                            labelText="Password"
                            id="password"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "password",
                                onChange: this.handleChange,
                                required: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Lock /*className={classes.inputIconsColor}*//>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {/*error={!(/^[a-z][a-z0-9]{4,14}$/i.test(this.state.password))}*/}
                        <CustomInput
                            labelText="Confirm Password"
                            id="confirmPassword"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "password",
                                onChange: this.handleChange,
                                required: true,
                                error: this.state.password!==this.state.confirmPassword,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Lock /*className={classes.inputIconsColor}*//>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="rose" simple size="lg">
                            취소
                        </Button>
                        <Button color="primary" onClick={this.postSignUp} simple size="lg">
                            회원가입
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(checkStyles)(SignUpForm);
