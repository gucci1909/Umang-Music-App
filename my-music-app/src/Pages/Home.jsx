import { Box, Button, Heading, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  favSong_add,
  favSong_list,
} from "../Redux/FavSongRedux/favSongs.actions";

function Home() {

  const [data, setData] = useState([]);
  const [favSong, setFavSongs] = useState([]);
  const dispatch = useDispatch();
  
  const handleData = async () => {
    const access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    let config = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    const res = await axios.get("http://localhost:8080/songs", config);
    const data = res.data;
    setData(data.Songs);
  };

  const handleFav = async (song_id) => {
    dispatch(favSong_add(song_id));
    setTimeout(() => {
      const user_id = JSON.parse(localStorage.getItem("_ID"));
      dispatch(favSong_list(user_id));
    }, 1000);
    handleShow();
  };

  const handleShow = async () => {
    try {
      const access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
      let config = {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      };
      const res = await axios.get(`http://localhost:8080/favSongs`, config);
      const data = res.data;
      setFavSongs(data.favSong);
      
    } catch (error) {
      console.log(error);
    }
  };

  const showButton = (song_id) => {
    var count = 0;
    const ID = JSON.parse(localStorage.getItem("_ID"));
    for (var i = 0; i < favSong.length; i++) {
      if (favSong[i].songID[0] === song_id && favSong[i].userID === ID) {
        count += 1;
      }
    }
    if (count >= 1) {
      return "";
    } else {
      return <Button onClick={() => handleFav(song_id)}>Add to Fav</Button>;
    }
  };

  useEffect(() => {
    handleShow();
    handleData();
    const user_id = JSON.parse(localStorage.getItem("_ID"));
    dispatch(favSong_list(user_id));
  }, [dispatch]);

  return (
    <Box>
      <Heading>UMANG MUSIC</Heading>
      <Box>
        {data &&
          data.map((el, i) => (
            <Box key={i}>
              <Text>{el.title}</Text>
              <Image src={el.imageURL} />
              <Link to={`/songs/${el._id}`}>
                <Button>Play Now!</Button>
              </Link>
              {showButton(el._id)}
            </Box>
          ))}
      </Box>
    </Box>
  );

}

export default Home;
