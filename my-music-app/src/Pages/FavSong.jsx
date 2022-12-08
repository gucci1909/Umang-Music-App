import { Box, Button, Container, Flex, Grid, GridItem, Heading, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import {RiDeleteBin6Line} from "react-icons/ri"
import { favSong_delete, favSong_list } from '../Redux/FavSongRedux/favSongs.actions';

function FavSong() {
  const {favSong} = useSelector((store)=>store.favSong);
  console.log(favSong);
  const dispatch = useDispatch();
  const handleDelete = (song_id)=>{
    dispatch(favSong_delete(song_id));
  }
  useEffect(()=>{
    const user_id = JSON.parse(localStorage.getItem("_ID"));
    dispatch(favSong_list(user_id));
  })
  return (
    <Box>
      <Heading
        color={"tomato"}
        textAlign="center"
        mt={{ lg: "15px" }}
        zIndex={2}
        mb="40px"
        fontSize={{ base: "20px", md: "30px", lg: "40px" }}
      >
        FAVOURITE SONGS
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
          {favSong && favSong?.map((el, i) => (
              <GridItem mb="30px" key={i}>
                <Box>
                  <VStack>
                    <Box borderRadius={"20px"}>
                      <Image
                        h={"350px"}
                        borderRadius="20px"
                        w={"350px"}
                        src={el.songID[0].imageURL}
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
                        {el.songID[0].title}
                      </Text>
                    </Box>
                    <Flex gap="20px">
                      <Link to={`/songs/${el.songID[0]._id}`}>
                        <Button colorScheme={"red"}>Play Now!</Button>
                      </Link>
                      <Button onClick={()=>handleDelete(el._id)} colorScheme={"blue"}>
                      <RiDeleteBin6Line/>
                      </Button>
                    </Flex>
                  </VStack>
                </Box>
              </GridItem>
            ))}
        </Grid>
      </Container>
      
      
    </Box>
  )
}

export default FavSong
