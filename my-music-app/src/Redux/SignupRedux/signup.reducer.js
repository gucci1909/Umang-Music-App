import { ERROR_SIGNUP, LOADING_SIGNUP, RESET_SIGNUP, SUCCESS_SIGNUP } from "./signup.types"

const InitialState = {
    success : false,
    loading:false,
    error:false
}

export const signup_Reducer = (state=InitialState,{type,payload})=>{
    switch(type){
        case LOADING_SIGNUP:
            return {...state,loading:true,error:false,success:false}
        case ERROR_SIGNUP:
            return {...state,loading:false,error:true,success:false}
        case SUCCESS_SIGNUP:
            return {...state,loading:false,error:false,success:true}
        case RESET_SIGNUP:
            return {...state,loading:false,error:false,success:false}
        default:
            return state
    }

}