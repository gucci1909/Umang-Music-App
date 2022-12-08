import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import {
  favSong_add,
  favSong_list,
} from "../Redux/FavSongRedux/favSongs.actions";
import Pagination from "../Components/Pagination";

function Home() {
  const [data, setData] = useState([]);
  const [favSong, setFavSongs] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const handlePageChange = (value) => {
    setPage(value);
  };

  const handlePagination = (value) => {
    setPage((prev) => prev + value);
  };
  const handleData = async (page) => {
    const access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
    let config = {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    };
    const res = await axios.get(
      `http://localhost:8080/songs?page=${page}`,
      config
    );
    const data = res.data;
    setData(data.Songs);
  };

  const handleFav = (song_id) => {
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
      return (
        <Button colorScheme={"pink"}>
          <AiFillHeart />
        </Button>
      );
    } else {
      return (
        <Button colorScheme={"linkedin"} onClick={() => handleFav(song_id)}>
          Add to Fav
        </Button>
      );
    }
  };

  useEffect(() => {
    handleShow();
    handleData(page);
    const user_id = JSON.parse(localStorage.getItem("_ID"));
    dispatch(favSong_list(user_id));
  }, [dispatch, page]);

  return (
    <Box>
      <Heading
        color={"tomato"}
        textAlign="center"
        mt={{ lg: "5px" }}
        zIndex={2}
        mb="40px"
        fontSize={{ base: "20px", md: "30px", lg: "40px" }}
      >
        UMANG MUSIC
      </Heading>
      <Container maxW={{ base: "full", lg: "auto" }} p={{ base: "2", lg: "0" }}>
        <Grid
          w="full"
          templateColumns={{
            base: "repeat(1,1fr)",
            md: "repeat(3,1fr)",
            lg: "repeat(3,1fr)",
          }}
        >
          {data &&
            data.map((el, i) => (
              <GridItem mb="30px" key={i}>
                <Box>
                  <VStack>
                    <Box borderRadius={"20px"}>
                      <Image
                        h={"350px"}
                        borderRadius="20px"
                        w={"350px"}
                        src={el.imageURL}
                      />
                    </Box>
                    <Box>
                      <Text
                        as="abbr"
                        color="tomato"
                        fontFamily="Raleway,sans-serif"
                        fontSize="24px"
                        fontWeight="500"
                        textTransform="uppercase"
                      >
                        {el.title}
                      </Text>
                    </Box>
                    <Flex gap="20px">
                      <Link to={`/songs/${el._id}`}>
                        <Button colorScheme={"red"}>Play Now!</Button>
                      </Link>
                      <Box>{showButton(el._id)}</Box>
                    </Flex>
                  </VStack>
                </Box>
              </GridItem>
            ))}
        </Grid>
      </Container>
      <Flex 
      justifyContent={"center"}
      alignContent="center"
      gap="20px"
      >
        <Button
          disabled={page === 1}
          onClick={() => handlePagination(-1)}
          variant={"ghost"}
        >
          PREV
        </Button>

        {
          <Pagination
            totalPages={2}
            currentPage={page}
            handlePageChange={handlePageChange}
          />
        }
        <Button
          disabled={page === 2}
          onClick={() => handlePagination(1)}
          variant={"ghost"}
        >
          NEXT
        </Button>
      </Flex>
    </Box>
  );
}

export default Home;
