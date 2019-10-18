import storage from "../../storage";
import axios from "axios";

const token = storage.get('token');
const url = "http://15.164.57.47:8080/olive/";
// const url = "http://localhost:8080/olive/";

////////////////////// 사용자 API //////////////////////

// 로그인
export function login(userId, userPw){
    return axios.post(url + 'sign', {headers: {'Content-type': 'application/json'},
        "id": userId,
        "pw": userPw,
    });
};

// 회원가입(사용자)
export function signUpClient(userData){
    return axios.post(url + 'sign/client', {headers: {'Content-type': 'application/json'},
        "age": userData.age,
        "id": userData.id,
        "male": userData.male,
        "name": userData.name,
        "phoneNumber": userData.phoneNumber,
        "pw": userData.pw
    });
};

// 회원가입(관리자)
export function signUpAdmin(userData){
    return axios.post(url + 'sign/admin', {headers: {'Content-type': 'application/json','Authorization': token},
        "age": userData.age,
        "id": userData.id,
        "male": userData.male,
        "name": userData.name,
        "phoneNumber": userData.phoneNumber,
        "pw": userData.pw
    });
};

// 회원정보 조회(사용자)
export function getUserData(){
    return axios.get(url + `sign/check`, { headers: {'Authorization': token}});
};

// 회원정보 조회(관리자)
export function getUserDataAdmin(userId){
    return axios.get(url + `sign/${userId}`, { headers: {'Authorization': token}});
};

// 회원정보 수정
export function putUserData(userData){
    return axios.put(url + 'sign', {headers: { 'Content-type': 'application/json', 'Authorization': token},
        "age": userData.age,
        "id": userData.id,
        "male": userData.male,
        "name": userData.name,
        "phoneNumber": userData.phoneNumber,
        "pw": userData.password });
};

// 회원 예약 정보 조회
export function getReservationDataByUser(type){
    return axios.get(url + `reservation/user/type/${type}`
                    , { headers: { 'Content-type': 'application/json', 'Authorization': token}});
};

// 회원 삭제
export function deleteUser(userId, userPw){
    return axios.delete(url + `sign`,{ "id": userId, "pw": userPw
    , headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

////////////////////// 빵 API //////////////////////

// 모든 빵 정보 가져오기
export async function getAllBreads(){
    const response = await axios.get(url + 'bread',);
    if(response.status === 200){
        return response.data;
    }
    else{
        return null;
    }
}

//재료와 원산지 가져오기
export async function getIngrediants(){
    const response = await axios.get(url + 'bread/ingredients',{headers: {"Authorization": token}})
    if(response.status === 200){
        return response.data;
    }
    else{
        return null;
    }
}

// 빵 이미지 가져오기
export function getTodayBread(){
    return axios.get(url + 'bread/today');
}

//빵 저장
export function saveBread(breadData, file){
    const formData = new FormData();
    const json = JSON.stringify(breadData);
    formData.append("file", file);
    formData.append('json', json);
    const response = axios.post(url + 'bread', formData, {headers: {"content-type": "multipart/form-data", "Authorization": token}})

    return response.status

}

// 빵 정보 수정
export async function updateBread(breadData, file){
    console.log(file);

    const formData = new FormData();
    const json = JSON.stringify(breadData);
    formData.append('json', json);
    if(file !== undefined || file !== null){
        formData.append("file", file);
    }

    const response = await axios.put(url + 'bread', formData, {headers: {'Content-type': 'application/json', "Authorization": token}});
    return response.status;
}

// 빵 매진 상태 수정
export async function updateStateOfSoldOut(breadId, sold_out){
    const response = await axios.put(url + `bread/id/${breadId}/sold_out/${sold_out}`,{}, {headers: {"Authorization": token}})
    return response.status;
}

// 빵 추천 상태 수정
export async function updateStatus(breadId, status){
    const response = await axios.put(url + `bread/id/${breadId}/state/${status}`,{}, {headers: {"Authorization": token}})
    return response.status;
}

//빵 삭제
export async function deleteBread(breadId, isDelete){
    const response = await axios.delete(url + `bread/id/${breadId}/delete/${isDelete}`,{headers: { 'Authorization': token}});
    return response.status;
}

////////////////////// 게시판 API //////////////////////

// 게시물 리스트 가져오기
export function getBoardList(type, num){
    return axios.get(url + `board/${type}/page/${num}`);
}

// 게시물 상세 조회
export function getBoardById(boardId){
    return axios.get(url + `board/id/${boardId}`, {headers: { 'Authorization': token}});
}

// 공지사항 조회
export function getNotice(){
    return axios.get(url + `board/notice`);
}

// 게시물 저장
export function savePost(type, title, context, isSecret, isNotice){
    return axios.post(url + `board`, {
        "boardType": type,
        "boardId": 0,
        "context": context,
        "isNotice": isNotice,
        "isSecret": isSecret,
        "title": title},
        {headers: {'Content-type': 'application/json','Authorization': token}

    });
}

// 게시물 수정
export function updatePost(boardId, title, content, notice, secret){
    return axios.put(url + 'board', {
        "boardId": boardId,
        "context": content,
        "notice": notice,
        "secret": secret,
        "title": title
    }, {headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

// 게시물 삭제
export function deletePost(boardId){
    return axios.delete(url + `board/id/${boardId}`,{headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

// 댓글 저장
export function saveComment(boardId, userId, content, userName){
    return axios.post(url + 'board/comment',{
        "boardId": boardId,
        "content": content,
        "updateTime": "null",
        "userId": userId,
        "userName": userName
    },
        {headers: {'Content-type': 'application/json','Authorization': token}});
}


////////////////////// 예약 API //////////////////////

export function updateReservatioinState(reservationId){
    return axios.put(url+`reservation/${reservationId}`
        ,{},{headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

export function saveReservation(breadInfo, bringTime, userEmail){
    return axios.post(url+'reservation'
        ,{
            "breadInfo": breadInfo,
            "bringTime": bringTime,
            "userEmail": userEmail
        },{headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

export function updateReservation(reservationId, reservationSaveRequest){
    return axios.put(url+'reservation'
        ,{
            "reservationId": reservationId,
            "reservationSaveRequest": reservationSaveRequest
        },{headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

export function deleteReservation(reservationId){
    return axios.delete(url+`reservation/${reservationId}`
        ,{headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

export function postReservationDate(reservationType, selectDate){
    return axios.post(url+'reservation/date'
        ,{
            "reservationType": reservationType,
            "selectDate": selectDate
        },{headers: { 'Content-type': 'application/json', 'Authorization': token}});
}

////////////////////// 그래프 API //////////////////////

export async function getReservationDataByDate(date){
    const response = await axios.post(url + 'reservation/date', {
        "reservationType": "COMPLETE",
        "selectDate": date
    }, { headers: { 'Content-type': 'application/json', 'Authorization': token } });
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export async function getReservationDataByRange(startDate, endDate){
    const response = await axios.post(url + 'reservation/date', {
        "reservationType": "COMPLETE",
        "startDate": startDate,
        "endDate": endDate
    }, { headers: { 'Content-type': 'application/json', 'Authorization': token } });
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export async function getGraphData(){
    const response = await axios.get(url + 'sales/graph', { headers: { 'Authorization': token } });
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export async function getGraphDataByYear(year){
    const response = await axios.get(url + `sales/graph/year/${year}`, { headers: { 'Authorization': token } });
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export async function getGraphDataByYearAndMonth(year, month){
    const response = await axios.get(url + `sales/graph/year/${year}/month/${month}`, { headers: { 'Authorization': token } });
    if (response.status === 200) {
        return response.data;
    }
    return null;
}

export function saveOfflineSale(date, sales){
    return axios.post(url + 'sales', {date: date, sales: sales}, {headers: { 'Authorization': token }});
}
