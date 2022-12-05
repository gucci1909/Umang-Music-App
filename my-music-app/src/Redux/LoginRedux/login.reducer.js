import { ERROR_LOGIN, LOADING_LOGIN, REFRESH_EXPIRE, REFRESH_TOKEN_LOGIN, REMAIN_LOGIN, RESET_LOGIN, SUCCESS_LOGIN } from "./login.types"

const InitialState = {
    loading :false,
    error:false,
    isAuth : false,
    _id: "",
    access_token : "",
    refresh_token :"",
    userType : ""
}

export const login_reducer =(state=InitialState,{type,payload})=> {
    switch(type){
        case LOADING_LOGIN:
            return {
                ...state,
                loading:true,
                error : false,
                isAuth : false
            }
        case ERROR_LOGIN:
            return {
                ...state,
                loading:false,
                error:true,
                isAuth : false
            }
        case SUCCESS_LOGIN:
            return {
                ...state,
                loading:false,
                error:false,
                isAuth : true,
                _id:payload.id,
                access_token : payload.AccessToken,
                refresh_token:payload.RefreshToken,
                userType : payload.userType
            }
        case RESET_LOGIN:
            return {
                ...state,
                loading :false,
                error:false,
                isAuth : false,
                _id: "",
                access_token : "",
                refresh_token :"",
                userType : ""
            }
        case REMAIN_LOGIN:
            return {
                ...state,
                isAuth:true
            }
        case REFRESH_TOKEN_LOGIN:
            return {
                ...state,
                isAuth:true,
                access_token:payload.AccessToken
            }
        case REFRESH_EXPIRE:
            return {
                ...state,
                loading:false,
                error:false,
                isAuth : false,
                access_token : "",
                refresh_token:"",
                userType : ""
            }
        default:
            return state

    }
}