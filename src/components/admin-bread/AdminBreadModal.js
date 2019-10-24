import React from 'react';
import CustomInput from "../common/CustomInput.jsx";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "../common/Button.jsx";

import InputAdornment from "@material-ui/core/InputAdornment";
import Lock from "@material-ui/icons/LockOutlined";
import TextField from '@material-ui/core/TextField';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Check from "@material-ui/icons/Check";
import checkStyles from "../../styles/customCheckboxRadioSwitch";
import {DropzoneArea} from "material-ui-dropzone";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";

import * as api from "../common/Api"

let styles = {...checkStyles};

class AdminBreadModal extends React.Component {
    state = {
        description: "",
        detailDescription: "",
        ingredientsList: [],
        name: "",
        price: 0,
        isCreating: false,
        ingredients: [],
        ingredientName: "",
        origin: "",
        files: [],
        days: []
    };
    dayTypes = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    componentDidMount() {
        this.getIngredients();
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    };

    toggleCreating = () => {
        this.setState({
            isCreating: !this.state.isCreating
        });
    };

    resetInput = () => {
        this.setState({
            description: "",
            detailDescription: "",
            ingredientsList: [],
            name: "",
            price: 0,
            isCreating: false,
            ingredientName: "",
            origin: "",
            files: [],
            days: []
        });
    };

    saveBread = () => {
        const breadData = {
            "days": this.state.days,
            "description": this.state.description,
            "detailDescription": this.state.detailDescription,
            "ingredientsList": this.state.ingredientsList,
            "name": this.state.name,
            "price": this.state.price,
            "state": "NORMAL"
        };
        const statusCode = api.saveBread(breadData, this.state.files[0]);

        if(statusCode===200) {
            this.props.addAlert(`${this.state.name} 추가완료`);
            this.props.resetTable();
            this.props.onClose();
        }else{
            this.props.addAlert(`${this.state.name}를 저장하는데 오류가 발생하였습니다.`);
            this.props.resetTable();
            this.props.onClose();
        }

    };

    handleChangeFile = files => {
        this.setState({
            files: files
        });
    };

    handleChangeIngredients = (e) => {
        if(e.target.checked){
            this.setState({
                ingredientsList: this.state.ingredientsList.concat(this.state.ingredients.filter(ingredient => ingredient.name===e.target.id)[0])
            });
        }
        else{
            this.setState({
                ingredientsList: this.state.ingredientsList.filter(ingredient => ingredient.name!==e.target.id)
            });
        }
    };

    handleChangeDayTypes = (e) => {
        if(e.target.checked){
            this.setState({
                days: this.state.days.concat(this.dayTypes.filter(day => day===e.target.id)[0])
            });
        }
        else{
            this.setState({
                days: this.state.days.filter(day => day!==e.target.id)
            });
        }
    };

    getIngredients = async () => {
        const response = await api.getIngrediants();
        if(response === null || response === undefined || response === ""){
            this.setState({
                ingredients: []
            });
        }

        this.setState({
            ingredients: response
        });
    };

    handleAddIngredient = () => {
        this.setState({
            ingredients: this.state.ingredients.concat({
                name: this.state.ingredientName,
                origin: this.state.origin
            })
        });
        this.toggleCreating();
    };

    render() {
        const {classes} = this.props;
        const {isCreating} = this.state;
        const wrapperDiv = classNames(
            classes.checkboxAndRadio,
            classes.checkboxAndRadioHorizontal
        );
        if(this.props.isOpen===false) {
            //this.getIngredients();
            return null;
        }
        return (
            <React.Fragment>
                <Dialog
                    open={this.props.isOpen}
                    onClose={this.props.onClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">빵 추가</DialogTitle>
                    <DialogContent>
                        <CustomInput
                            labelText="빵 이름"
                            id="name"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                                value: this.state.name,
                                onChange: this.handleChange,
                                required: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Lock /*className={classes.inputIconsColor}*//>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <CustomInput
                            labelText="가격"
                            id="price"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "number",
                                value: this.state.price,
                                onChange: this.handleChange,
                                required: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Lock /*className={classes.inputIconsColor}*//>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            id="description"
                            label="간단한 설명"
                            multiline
                            rows="1"
                            fullWidth
                            defaultValue= {this.state.description}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            onChange= {this.handleChange}
                        />
                        <TextField
                            id="detailDescription"
                            label="자세한 설명"
                            multiline
                            rows="7"
                            fullWidth
                            defaultValue= {this.state.detailDescription}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            onChange= {this.handleChange}
                        />
                        
                        <div>
                        {
                            this.state.ingredients.map((ingredient, index) => (
                                <React.Fragment key={index}>
                                    <div className={wrapperDiv}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id={ingredient.name}
                                                    onChange={this.handleChangeIngredients}
                                                    checkedIcon={<Check className={classes.checkedIcon} />}
                                                    icon={<Check className={classes.uncheckedIcon} />}
                                                    classes={{ checked: classes.checked }}
                                                />
                                            }
                                            classes={{ label: classes.label }}
                                            label={`${ingredient.name}(${ingredient.origin})`}
                                        />
                                    </div>
                                </React.Fragment>
                            ))
                        }
                        </div>
                        <div>
                        {
                            isCreating === false
                                ?
                                (
                                    <button onClick={this.toggleCreating}>+</button>
                                )
                                :
                                (
                                    <React.Fragment>
                                        <CustomInput
                                            labelText="재료 이름"
                                            id="ingredientName"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "text",
                                                onChange: this.handleChange,
                                                required: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Lock /*className={classes.inputIconsColor}*//>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <CustomInput
                                            labelText="재료 원산지"
                                            id="origin"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: "text",
                                                onChange: this.handleChange,
                                                required: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Lock /*className={classes.inputIconsColor}*//>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <button onClick={this.handleAddIngredient}>재료추가</button>
                                    </React.Fragment>
                                )
                        }
                        </div>
                        {
                            this.dayTypes.map((day, index) => (
                                <React.Fragment key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id={day}
                                                onChange={this.handleChangeDayTypes}
                                                checkedIcon={<Check className={classes.checkedIcon} />}
                                                icon={<Check className={classes.uncheckedIcon} />}
                                                classes={{ checked: classes.checked }}
                                            />
                                        }
                                        classes={{ label: classes.label }}
                                        label={day}
                                    />
                                </React.Fragment>
                            ))
                        }

                        <div>
                            <DropzoneArea onChange={this.handleChangeFile} filesLimit={1} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose} color="rose" simple size="lg">
                            취소
                        </Button>
                        <Button onClick={this.resetInput} color="info" simple size="lg">
                            초기화
                        </Button>
                        < Button color="primary" onClick={this.saveBread} simple size="lg">
                            빵 추가
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(AdminBreadModal);
