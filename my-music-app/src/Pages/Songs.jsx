import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import {
  GrPause,
  GrPlay,
  GrChapterNext,
  GrChapterPrevious,
} from "react-icons/gr";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io.connect("http://localhost:8080");
console.log(socket);

function Songs() {
  const { id } = useParams();
  const [state, setState] = useState("");
  const [message, setMessage] = useState([]);
  const [datas, setDatas] = useState({});
  const audioElement = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const space = useRef(null);
  const handleChange = (event) => {
    setState(event.target.value);
  };
  const handleSubmit = (state, datas) => {
    if (state !== "") {
      const room1 = Number(datas.roomNo);
      socket.emit("send_message", { state, room1 });
      setState("");
    }
  };
  const handleKeyPress = (event, state, datas) => {
    if (event.key === "Enter") {
      if (state !== "") {
        const room1 = Number(datas.roomNo);
        socket.emit("send_message", { state, room1 });
        setState("");
      }
    }
  };
  const handleSong = async () => {
    try {
      const access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
      let config = {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      };
      const res = await axios.get(`http://localhost:8080/songs/${id}`, config);
      const data = res.data;
      space.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const room1 = Number(data.Song.roomNo);
      socket.emit("join_room", room1);
      setDatas(data.Song);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSong();
  }, [message]);

  useEffect(() => {
    if (isPlaying) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  });

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const msg = data.state;
      setMessage((message) => [...message, { msg }]);
    });
  }, []);

  return (
    <Box>
      <Box width="55%" height={"610px"} position="absolute">
        <Heading
          color={"#38B2AC"}
          textAlign="center"
          mt={{ lg: "5px" }}
          zIndex={2}
          mb="40px"
          fontSize={{ base: "20px", md: "30px", lg: "27px" }}
        >
          UMANG MUSIC
        </Heading>
        <Flex justifyContent={"center"}>
          <Text
            as="u"
            color="tomato"
            fontFamily="Raleway,sans-serif"
            fontSize="32px"
            fontWeight="500"
            textTransform="uppercase"
          >
            {datas.title}
          </Text>
        </Flex>
        <Flex alignContent="center" justifyContent={"center"}>
          <Box display={"flex"} flexDirection="column" h={"100px"} w={"150px"}>
            <Text mt={"20px"} ml={"30px"} fontSize={"24px"} color="tomato">
              ARTIST NAMES
            </Text>
            <Text
              ml={"20px"}
              mt={"20px"}
              fontSize="17px"
              as="cite"
              w="100px"
              color="white"
              bg="tomato"
              borderRadius={"20px"}
              p="1"
            >
              {datas.artistNames}
            </Text>
          </Box>

          <Image
            mt="20px"
            ml={"40px"}
            h={"350px"}
            borderRadius="25px"
            w={"500px"}
            src={datas.imageURL}
          />
          <Box display={"flex"} flexDirection="column" h={"100px"} w={"200px"}>
            <Text mt={"20px"} color="tomato" ml={"20px"} fontSize="24px">
              RELEASE YEAR OF SONG
            </Text>
            <Text
              ml={"20px"}
              mt={"20px"}
              fontSize={"24px"}
              p={1}
              borderRadius="5px"
              as="u"
              w="60px"
              color="white"
              bg="tomato"
            >
              {datas.releaseYearOfSong}
            </Text>
          </Box>
        </Flex>
        <audio src={datas.songURL} ref={audioElement}></audio>
        <Flex
          alignContent={"center"}
          justifyContent="center"
          gap="20px"
          mt="10px"
        >
          <Button variant={"ghost"}>
            <GrChapterPrevious />
          </Button>
          {!isPlaying ? (
            <Button variant={"ghost"} onClick={() => setIsPlaying(!isPlaying)}>
              <GrPlay />
            </Button>
          ) : (
            <Button
              colorScheme={"blue"}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <GrPause />
            </Button>
          )}
          <Button variant="ghost">
            <GrChapterNext />
          </Button>
        </Flex>
      </Box>
      <Box
        borderRadius={"15px"}
        border={"0.5px solid blue"}
        mt={"10px"}
        height="610px"
        display={"inline-block"}
        ml={"905px"}
        width={"40%"}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        bgImage={`url("https://media.istockphoto.com/id/1175435360/vector/music-note-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=R7s6RR849L57bv_c7jMIFRW4H87-FjLB8sqZ08mN0OU=")`}
      >
        <Heading
          color={"#38B2AC"}
          textAlign="center"
          mt={{ lg: "5px" }}
          zIndex={2}
          fontSize={{ base: "20px", md: "30px", lg: "27px" }}
        >
          COMMENTS SECTION
        </Heading>

        <Flex
          flexDirection={"column"}
          height={"520px"}
          mt={{ base: "-15px", lg: "auto" }}
          overflow="scroll"
        >
          {message &&
            message.map((el, i) => (
              <Flex
                justify="right"
                alignItems="right"
                height="auto"
                w={{ base: "auto", lg: "auto" }}
                mt={{ base: "20px", lg: "20px" }}
                ml={{ base: "-480px", lg: "150px" }}
                gap="2"
                key={i}
              >
                <Box
                  bg="#38B2AC"
                  w={{ base: "200px", lg: "auto" }}
                  p={2}
                  h={{ base: "auto", lg: "auto" }}
                  borderRadius={"20px"}
                  mt={"10px"}
                  color="white"
                >
                  <Text fontSize="24px">{el.msg}</Text>
                </Box>
              </Flex>
            ))}
          <div ref={space}></div>
        </Flex>
      </Box>

      <Flex
        justify={"center"}
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        width={"100%"}
      >
        <Input
          mb="10px !important"
          w={{ base: "230px", lg: "450px" }}
          position="fixed"
          left={0}
          right={0}
          bottom={0}
          color="darkBlue"
          ml={{ base: "0px", lg: "940px" }}
          height="3rem"
          placeholder="Add a comment..."
          _placeholder={{ color: "inherit" }}
          autoComplete="off"
          onKeyPress={(e) => handleKeyPress(e, state, datas)}
          bgColor={"lightskyblue"}
          type="text"
          value={state}
          onChange={(e) => handleChange(e)}
        />
        <Button
          position="fixed"
          w={{ lg: "70px" }}
          ml={{ base: "230px", lg: "1400px" }}
          left={0}
          right={0}
          bottom={0}
          mb="13px"
          zIndex={2}
          colorScheme={"blue"}
          onClick={() => handleSubmit(state, datas)}
        >
          <IoMdSend />
        </Button>
      </Flex>
    </Box>
  );
}

export default Songs;
