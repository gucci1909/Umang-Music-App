import { SUCCESS_COUNT_FAVSONG } from "./favSongs.types";

const InitialState = {
    count : 0,
    favSong: [],
    loading : false,
    error :false
}

export const favSongReducer = (state=InitialState,{type,payload})=>{
    switch(type){
        case SUCCESS_COUNT_FAVSONG:
            return {...state,
            count : payload.length
            }
        default:
            return state;
    }
} 