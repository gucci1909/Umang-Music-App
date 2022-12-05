import {
  ERROR_LOGIN,
  LOADING_LOGIN,
  REFRESH_EXPIRE,
  REFRESH_TOKEN_LOGIN,
  REMAIN_LOGIN,
  RESET_LOGIN,
  SUCCESS_LOGIN,
} from "./login.types";
import axios from "axios";

export const post_login = (value) => async (dispatch) => {
  dispatch({ type: LOADING_LOGIN });
  try {
    const res = await axios.post(`http://localhost:8080/signin`, value);
    const data = res.data;
    console.log(data);
    localStorage.setItem("ACCESS_TOKEN", JSON.stringify(data.AccessToken));
    localStorage.setItem("REFRESH_TOKEN", JSON.stringify(data.RefreshToken));
    localStorage.setItem("_ID", JSON.stringify(data.id));
    localStorage.setItem("USERNAME", JSON.stringify(data.username));
    dispatch({ type: SUCCESS_LOGIN, payload: data });
  } catch (error) {
    console.log(error);
    dispatch({ type: ERROR_LOGIN, payload: error });
    setTimeout(() => {
      dispatch({ type: RESET_LOGIN });
    }, 2000);
  }
};

//remaining the user login

export const verification = () => async (dispatch) => {
  if (typeof localStorage.getItem("ACCESS_TOKEN") == "undefined") {
    var access_token = "";
  } else {
    access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
  }

  if (typeof localStorage.getItem("REFRESH_TOKEN") == "undefined") {
    var refresh_token = "";
  } else {
    refresh_token = JSON.parse(localStorage.getItem("REFRESH_TOKEN"));
  }

  // var access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN")) || "";
  // var refresh_token = JSON.parse(localStorage.getItem("REFRESH_TOKEN")) || "";
  try {
    const headers = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    const res = await axios.post(
      `http://localhost:8080/signin/verify`,
      {},
      { headers: headers }
    );
    const data = res.data;
    if (data.AccessToken) {
      localStorage.removeItem("ACCESS_TOKEN");
      dispatch({ type: REFRESH_TOKEN_LOGIN, payload: data });
      localStorage.setItem("ACCESS_TOKEN", JSON.stringify(data.AccessToken));
    } else {
      dispatch({ type: REMAIN_LOGIN });
    }
    console.log(data);
  } catch (error) {
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("_ID");
    localStorage.removeItem("USERNAME");
    dispatch({ type: REFRESH_EXPIRE });
    console.log(error);
  }
};

//google login

export const google_login = () => async (dispatch) => {
  // sessionStorage.clear();
  try {
    const res = await axios.get(`http://localhost:8080/auth/success`);
    const data = res.data;
    console.log(data);
    // const data_collection = JSON.parse(data);
    // console.log(data_collection)
    // console.log(data_collection)
    // if(data_collection.passport.user){
      // dispatch({type:REMAIN_LOGIN});
    // }
    // console.log(data_collection.passport.user.create[0].username);
    // if (data_collection) {
      // localStorage.setItem(
      //   "ACCESS_TOKEN",
      //   JSON.stringify(data_collection.passport.user.AccessToken)
      // );
      // localStorage.setItem(
      //   "_ID",
      //   JSON.stringify(data_collection.passport.user.create[0]._id)
      // );
      // localStorage.setItem(
      //   "USERNAME",
      //   JSON.stringify(data_collection.passport.user.create[0].username)
      // );
      // dispatch({ type: REMAIN_LOGIN });
    // } else {
      // console.log("error");
    // }
  } catch (error) {
    console.log(error);
  }
};
