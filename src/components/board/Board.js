import React from 'react';
import axios from "axios";

import Button from "../common/Button.jsx";
import Pagination from "../common/Pagination";
import CustomTabs from "../common/CustomTabs";
import Table from "../common/Table";

import BoardModal from "../common/BoardModal";
import CreateBoardModal from "../common/CreateBoardModal";

import withStyles from "@material-ui/core/styles/withStyles";
import checkStyles from "../../styles/customCheckboxRadioSwitch";
import customStyles from "../../styles/common";

import storage from "../../storage";
import * as api from "../common/Api";


const styles = {...customStyles, ...checkStyles};

let email = null;
const token = storage.get('token');

class Board extends React.Component {
    state = {
        startPage: 0,
        endPage: 0,
        totalPage: 0,
        boardPage: 1,
        qnaPage: 1,
        board: [],
        qna: [],
        notice: [],
        isOpenTable: false,
        isOpenForm: false,
        selectedItem: {
            posts: {
                boardId: 0,
                context: '',
                insertTime: [],
                notice: null,
                secret: null,
                title: '',
                updateTime: [],
                userId: ''
            },
            comments: []
        },
        boardType: "board",
        checkedList: [],
        isAllCheck: false
    };

    componentDidMount() {
        this.email = storage.get('email');
        this.handleClickPage('board', 1);
    }

    getNotice = () => {
        api.getNotice().then(response => {
                this.setState({
                    notice: response.data.map(data=>({...data, checked:'false'})),
                });
        });
    };

    // 수정 필요
    handleClickPage = (type,num) => {
        if(type==='board'){
            this.getNotice();
            api.getBoardList("BOARD", num).then(response => {
                let startPage = 0;
                let endPage = 0;
                if(parseInt(response.data.totalPages/11) === parseInt(num/11)) {
                    startPage = parseInt(num / 11)*10 + 1;
                    if(startPage==1)
                        endPage = startPage + response.data.totalPages % 11 -1;
                    else
                        endPage = startPage + response.data.totalPages % 11;
                }
                else{
                    startPage = parseInt(num /11)*10 +1;
                    endPage = startPage + 9;
                }
                this.setState({
                    board: [...this.state.notice, ...response.data.content.map(data=>({...data, checked:'false'}))],
                    boardPage: num,
                    startPage: startPage,
                    endPage: endPage,
                    totalPage: response.data.totalPages,
                    checkedList: [],
                    boardType: "board"
                });
            });
        }
        else{
            axios.get(`http://15.164.57.47:8080/olive/board/QUESTION/page/${num}`
            ).then(response => {
                //this.props.onReceive(response.data.number);
                if(response.status===200) {
                    let startPage = 0;
                    let endPage = 0;
                    if(parseInt(response.data.totalPages/11) === parseInt(num/11)) {
                        startPage = parseInt(num / 11)*10 + 1;
                        if(startPage==1)
                            endPage = startPage + response.data.totalPages % 11 -1;
                        else
                            endPage = startPage + response.data.totalPages % 11;
                    }
                    else{
                        startPage = parseInt(num /11)*10 +1;
                        endPage = startPage + 9;
                    }
                    this.setState({
                        qna: response.data.content.map(data=>({...data, checked:'false'})),
                        qnaPage: num,
                        startPage: startPage,
                        endPage: endPage,
                        totalPage: response.data.totalPages,
                        checkedList: [],
                        boardType: 'qna'
                    });
                }
            });
        }
    };

    handleChangeCheckbox = (e) => {
        console.log(this.state.checkedList);
        let {boardType} = this.state;
        if(boardType==="board"){
            if(e.target.checked){
                if(e.target.id==='isAllCheck') {
                    this.setState({
                        isAllCheck: true,
                        board: this.state.board.map(
                            board =>
                                ({...board, checked: 'true'})
                        ),
                        checkedList: this.state.board.map(board => board)
                    });
                }
                else {
                    this.setState({
                        checkedList: this.state.checkedList.concat(this.state.board.filter(board => board.boardId === parseInt(e.target.id))[0]),
                        board: this.state.board.map(
                            board => board.boardId === parseInt(e.target.id)
                                ?
                                ({...board, checked: 'true'})
                                :
                                board
                        )
                    });
                }
            }
            else{
                if(e.target.id==='isAllCheck')
                    this.setState({
                        isAllCheck : false,
                        board: this.state.board.map(
                            board =>
                                ({...board, checked: 'false'})
                        ),
                        checkedList: []
                    });
                else
                    this.setState({
                        checkedList: this.state.checkedList.filter(board => board.boardId!==parseInt(e.target.id)),
                        board: this.state.board.map(
                            board => board.boardId===parseInt(e.target.id)
                                ?
                                ({...board, checked: 'false'})
                                :
                                board
                        )
                    });
            }
        }
        else{
            if(e.target.checked){
                if(e.target.id==='isAllCheck') {
                    this.setState({
                        isAllCheck: true,
                        qna: this.state.qna.map(
                            qna =>
                                ({...qna, checked: 'true'})
                        ),
                        checkedList: this.state.qna.map(qna => qna)
                    });
                }
                else {
                    this.setState({
                        checkedList: this.state.checkedList.concat(this.state.qna.filter(qna => qna.boardId === parseInt(e.target.id))[0]),
                        qna: this.state.qna.map(
                            qna => qna.boardId === parseInt(e.target.id)
                                ?
                                ({...qna, checked: 'true'})
                                :
                                qna
                        )
                    });
                }
            }
            else{
                if(e.target.id==='isAllCheck')
                    this.setState({
                        isAllCheck : false,
                        qna: this.state.qna.map(
                            qna =>
                                ({...qna, checked: 'false'})
                        ),
                        checkedList: []
                    });
                else
                    this.setState({
                        checkedList: this.state.checkedList.filter(qna => qna.boardId!==parseInt(e.target.id)),
                        qna: this.state.qna.map(
                            qna => qna.boardId===parseInt(e.target.id)
                                ?
                                ({...qna, checked: 'false'})
                                :
                                qna
                        )
                    });
            }
        }
    };

    toggleTableModal = () => {
        this.setState({
            isOpenTable: !this.state.isOpenTable
        });
    };

    toggleFormModal = () => {
        this.setState({
            isOpenForm: !this.state.isOpenForm
        });
    };

    handleClickBoard = () => {
        this.handleClickPage('board', this.state.boardPage);
    };

    handleClickQna = () => {
        this.handleClickPage('qna', this.state.qnaPage);
    };


    handleClickOpen = (id, type) => {
        api.getBoardById(id).then(response => {
                this.setState({
                    selectedItem: {
                        posts: {
                            boardId: response.data.boardId,
                            context: response.data.context,
                            insertTime: response.data.insertTime,
                            notice: response.data.isNotice,
                            secret: response.data.isSecret,
                            title: response.data.title,
                            updateTime: response.data.updateTime,
                            userId: response.data.userId
                        },
                        comments: response.data.comments === undefined ? [] : response.data.comments
                    }
                });    
        })
        
        if(type==='parent')
            this.toggleTableModal();
        
    };

    render() {
        const { classes } = this.props;
        const { board, qna, startPage, endPage, totalPage } = this.state;
        //let b = board.filter(board=> board.notice===false);
        let b = board.map(board => (
            [board.boardId.toString(), (board.notice===true?'공지':''), board.title, board.userId, board.insertTime.toString()]
        ));
        const q = qna.map(qna => (
            [qna.boardId.toString(), qna.title, qna.userId, qna.insertTime.toString()]
        ));
        let page = startPage;
        let pages = [];
        let pageNum = (this.state.boardType==='board'?this.state.boardPage:this.state.qnaPage);
        if(startPage!==1)
            pages = [...pages, {text: 'PREV', onClick: this.handleClickPage, type: startPage-1}];
        while(page<=endPage){
            pages = [...pages, {text: page, onClick: this.handleClickPage, type: 'num'}];
            page = page+1;
        }
        if(endPage!==totalPage)
            pages = [...pages, {text: 'NEXT', onClick: this.handleClickPage, type: endPage+1}];
        return (
            <React.Fragment>
                <BoardModal
                    isOpen={this.state.isOpenTable}
                    onClose={this.toggleTableModal}
                    item={this.state.selectedItem}
                    resetComment={this.handleClickOpen}
                    resetTable={this.handleClickPage}
                    boardPage={this.state.boardPage}
                    qnaPage={this.state.qnaPage}
                    isAdmin={false}
                    type={this.state.boardType}
                    addAlert={this.props.addAlert}
                />
                <CreateBoardModal
                    isOpen={this.state.isOpenForm}
                    onClose={this.toggleFormModal}
                    resetTable={this.handleClickPage}
                    isAdmin={false}
                    type={this.state.boardType}
                    addAlert={this.props.addAlert}
                />
                <CustomTabs
                    headerColor="primary"
                    tabs={[
                        {
                            onClick: this.handleClickBoard,
                            tabName: '게시판',
                            tabContent: (
                                <React.Fragment>
                                    <Table
                                        tableHeaderColor="primary"
                                        tableHead={["번호", "공지", "제목", "작성자", "날짜시간"]}
                                        tableData={
                                            b
                                        }
                                        type="modal"
                                        handleClickOpen={this.handleClickOpen}
                                        handleChangeCheckbox={this.handleChangeCheckbox}
                                        isAllCheck={this.state.isAllCheck}
                                    />
                                    <Pagination
                                        pages={pages}
                                        color="primary"
                                        type="board"
                                    />
                                    <div>
                                        <Button color="primary" onClick={this.toggleFormModal} simple size="lg">
                                            게시물 추가
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )
                        },
                        {
                            onClick: this.handleClickQna,
                            tabName: 'Q&A',
                            tabContent: (
                                <React.Fragment>
                                    <Table
                                        tableHeaderColor="primary"
                                        tableHead={["번호", "제목", "작성자", "날짜시간"]}
                                        tableData={
                                            q
                                        }
                                        type="modal"
                                        handleClickOpen={this.handleClickOpen}
                                        handleChangeCheckbox={this.handleChangeCheckbox}
                                        isAllCheck={this.state.isAllCheck}
                                    />
                                    <Pagination
                                        pages={pages}
                                        color="info"
                                        type="qna"
                                    />
                                    <div>
                                        <Button color="primary" onClick={this.toggleFormModal} simple size="lg">
                                            질문하기
                                        </Button>
                                    </div>
                                </React.Fragment>
                            )
                        }
                    ]}
                />
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Board);
