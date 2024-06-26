"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db/db"));
class SessionService {
    getSessionList(category, searchWord) {
        let searchCondition = "";
        if (searchWord !== "" && category !== "") {
            switch (category) {
                //카테고리가 번호일 때
                case "s_id":
                    searchCondition = `where s_id like '%${searchWord}%'`;
                    break;
                //카테고리가 사용자명일 때
                case "username":
                    searchCondition = `where username like '%${searchWord}%'`;
                    break;
                //카테고리가 점검 정책명일 때
                case "p_name":
                    searchCondition = `where p_name like '%${searchWord}%'`;
                    break;
                //카테고리가 세션명일 때
                case "s_name":
                    searchCondition = `where s_name like '%${searchWord}%'`;
                    break;
                case "s_time":
                    searchCondition = `where p_name like '%${searchWord}%'`;
                    break;
            }
        }
        const query = `select * from sessions ${searchCondition} order by s_name DESC`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    let sessions = [];
                    for (const session of result) {
                        sessions.push({
                            s_id: session === null || session === void 0 ? void 0 : session.s_id,
                            s_name: session === null || session === void 0 ? void 0 : session.s_name,
                            p_name: session === null || session === void 0 ? void 0 : session.p_name,
                            username: session === null || session === void 0 ? void 0 : session.username,
                            s_time: session === null || session === void 0 ? void 0 : session.s_time,
                        });
                    }
                    resolve(sessions);
                }
            });
        });
    }
    getInsertSessions(username, policyname) {
        const query = `insert into sessions (username, p_name, s_name, s_time, s_enabled) values ('${username}', '${policyname}', now(), '', 1);`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    // session 클릭시 상세 내역
    getSessionData(s_id) {
        const query = `select * from sessions where s_id = ?`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, s_id, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    let sessionDatas = [{
                            s_id: '',
                            username: '',
                            p_name: '',
                            s_name: '',
                            s_time: '',
                        }];
                    if (result.length > 0) {
                        resolve(result);
                    }
                    else {
                        resolve(sessionDatas);
                    }
                }
            });
        });
    }
    //상세내역 중에서도 log
    getSessionLog(s_id, lastFetchedTime) {
        //fetchTime이 존재할 때는 log_time을 해당 패치 타임 뒤에만 호출하도록
        let query = "";
        if (lastFetchedTime !== null && lastFetchedTime !== undefined) {
            query = `select * from sessionLog where s_id = ? AND log_time > '${lastFetchedTime}' ORDER BY log_time ASC`;
        }
        else {
            query = `select * from sessionLog where s_id = ? ORDER BY log_time ASC`;
        }
        return new Promise((resolve, reject) => {
            db_1.default.query(query, s_id, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    let sessionLogs = [{
                            log_id: '',
                            log_time: '',
                            log_text: '',
                            log_tc_name: '',
                            s_id: s_id
                        }];
                    if (result.length > 0) {
                        resolve(result);
                    }
                    else {
                        resolve(sessionLogs);
                    }
                }
            });
        });
    }
    //상세내역 중에서도 result
    getSessionResult(s_id) {
        const query = `select * from sessionResult where s_id = ?`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, s_id, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    let sessionResults = [{
                            r_id: '',
                            r_tc_name: '',
                            r_dut: '',
                            r_context: '',
                            r_status: '',
                            s_id: s_id,
                        }];
                    if (result.length > 0) {
                        resolve(result);
                    }
                    else {
                        resolve(sessionResults);
                    }
                }
            });
        });
    }
    // session 삭제
    deleteSession(s_id) {
        const query = `delete from sessions where s_id = '${s_id}'`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    getSessionListByExcel(category, searchWord, rows) {
        let searchCondition = "";
        if (searchWord !== "" && category !== "") {
            switch (category) {
                //카테고리가 번호일 때
                case "s_id":
                    searchCondition = `where s_id like '%${searchWord}%'`;
                    break;
                //카테고리가 사용자명일 때
                case "username":
                    searchCondition = `where username like '%${searchWord}%'`;
                    break;
                //카테고리가 점검 정책명일 때
                case "p_name":
                    searchCondition = `where p_name like '%${searchWord}%'`;
                    break;
                //카테고리가 세션명일 때
                case "s_name":
                    searchCondition = `where s_name like '%${searchWord}%'`;
                    break;
                case "s_time":
                    searchCondition = `where p_name like '%${searchWord}%'`;
                    break;
            }
        }
        const query = `select * from sessions ${searchCondition} order by s_name DESC limit ${rows}`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    let sessions = [];
                    for (const session of result) {
                        sessions.push({
                            "번호": session === null || session === void 0 ? void 0 : session.s_id,
                            "세션명": session === null || session === void 0 ? void 0 : session.s_name,
                            "점검 정책명": session === null || session === void 0 ? void 0 : session.p_name,
                            "작성자": session === null || session === void 0 ? void 0 : session.username,
                            "실행시간": session === null || session === void 0 ? void 0 : session.s_time,
                        });
                    }
                    resolve(sessions);
                }
            });
        });
    }
    updateSessionTime(s_id, s_name) {
        const s_start = new Date(s_name);
        const s_end = new Date();
        // 두 날짜 사이의 시간 차이 계산 (밀리초 단위)
        const timeDifference = s_end.getTime() - s_start.getTime();
        // 시간, 분, 초 단위로 변환
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        // 표기할 시간 문자열 생성
        let formattedTime = "";
        if (hours > 0) {
            formattedTime += `${hours}시 `;
        }
        if (minutes > 0) {
            formattedTime += `${minutes}분 `;
        }
        if (seconds > 0 || (hours === 0 && minutes === 0)) {
            formattedTime += `${seconds}초`;
        }
        let query = `update sessions set s_time = '${formattedTime}', s_enabled = 2 where s_id = ?`;
        return new Promise((resolve, reject) => {
            db_1.default.query(query, s_id, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.default = SessionService;
