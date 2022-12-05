import axios from "axios"
import { ERROR_SIGNUP, LOADING_SIGNUP, RESET_SIGNUP, SUCCESS_SIGNUP } from "./signup.types"

export const signup =(value)=> async(dispatch)=>{
    dispatch({type:LOADING_SIGNUP})
    try {
        const res = await axios.post(`http://localhost:8080/signup`,value);
        const data = res.data;
        console.log(data);
        dispatch({type:SUCCESS_SIGNUP});
        
    } catch (error) {
        console.log(error);
        dispatch({type:ERROR_SIGNUP})
        setTimeout(()=>{
            dispatch({type:RESET_SIGNUP})

        },3000)
        
    }

}