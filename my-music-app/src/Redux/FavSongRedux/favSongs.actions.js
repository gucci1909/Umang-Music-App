import axios from "axios";
import { ERROR_FAVSONG, SUCCESS_COUNT_FAVSONG } from "./favSongs.types";

export const favSong_add = (song_id) => async (dispatch) => {
  try {
    const access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    let config = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    const user_id = JSON.parse(localStorage.getItem("_ID"));
    const value = {
      userID: user_id,
      songID: song_id,
    };
    const res = await axios.post(
      "http://localhost:8080/favSongs",
      value,
      config
    );
    const data = res.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export const favSong_list = (user_id) => async (dispatch) => {
  try {
    const access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    let config = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };

    const res = await axios.get(
      `http://localhost:8080/favSongs/${user_id}`,
      config
    );
    const data = res.data;
    dispatch({ type: SUCCESS_COUNT_FAVSONG, payload: data });
  } catch (error) {
    dispatch({ type: ERROR_FAVSONG });
  }
};
