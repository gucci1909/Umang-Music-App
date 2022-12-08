import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import * as React from "react";
import { FiMenu } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });
  let { count } = useSelector((store) => store.favSong);
  console.log(count);
  const { isAuth } = useSelector((store) => store.login);

  const handleLogout = async () => {
    const refresh_token =
      JSON.parse(localStorage.getItem("REFRESH_TOKEN")) || "";
    if (refresh_token === "") {
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("_ID");
      localStorage.removeItem("USERNAME");
      const res = await axios.get("http://localhost:8080/auth/logout");
      console.log(res);
      screenLoad();
    } else {
      localStorage.removeItem("REFRESH_TOKEN");
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("_ID");
      localStorage.removeItem("USERNAME");
      screenLoad();
    }
  };
  var User;
  if (typeof localStorage.getItem("USERNAME") == "undefined") {
    User = "";
  } else {
    User = JSON.parse(localStorage.getItem("USERNAME"));
  }
  const screenLoad = () => {
    return window.location.reload(true);
  };
  return (
    <Box bgColor={"#000000"} display="flex">
      <Box>
        <Link to="/">
          <Image
            h="80px"
            w="100px"
            zIndex={2}
            ml="35px"
            borderRadius={"20px"}
            src={process.env.PUBLIC_URL + "/Images/U.jpg"}
          />
        </Link>
      </Box>
      {isDesktop ? (
        <Flex ml="650px" justifyContent={"space-between"}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? "#EDF2F7" : "#545e6f",
              background: isActive ? "#7600dc" : "#f0f0f0",
              marginRight: "30px",
              width: "100px",
              borderRadius: "20px",
              height: "40px",
              paddingLeft: "15px",
              fontSize: "26px",
              marginTop: "25px",
              marginLeft: "30px",
              marginBottom: "25px",
            })}
          >
            Home
          </NavLink>
          <Box display={"flex"}>
            <NavLink
              to="/favSong"
              style={({ isActive }) => ({
                color: isActive ? "#EDF2F7" : "#545e6f",
                background: isActive ? "#7600dc" : "#f0f0f0",
                marginRight: "30px",
                width: "145px",
                height: "40px",
                borderRadius: "20px",
                paddingLeft: "15px",
                fontSize: "26px",
                marginTop: "25px",
                marginBottom: "25px",
              })}
            >
              Fav Songs
            </NavLink>
            <Box
              backgroundColor={""}
              color={"#f0f0f0"}
              height="40px"
              width={"145px"}
              marginLeft="-10px"
              fontSize="26px"
              marginTop={"25px"}
            >
              <Text>{count}</Text>
            </Box>
          </Box>
          {!isAuth ? (
            ""
          ) : (
            <Text
              fontSize="26px"
              marginTop={"25px"}
              ml={"-60px"}
              color={"white"}
            >
              Hii, {User}
            </Text>
          )}
          <ButtonGroup marginLeft={"-70px"} marginTop="20px" gap="20px">
            {!isAuth ? (
              <>
                <Link to="/login">
                  <Button colorScheme={"gray"}>Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button colorScheme={"messenger"}>Sign Up</Button>
                </Link>
              </>
            ) : (
              <Button
                ml={"90px"}
                onClick={() => handleLogout()}
                colorScheme="pink"
                variant="solid"
              >
                Sign Out
              </Button>
            )}
          </ButtonGroup>
        </Flex>
      ) : (
        <IconButton
          variant="ghost"
          icon={<FiMenu fontSize="1.25rem" />}
          aria-label="Open Menu"
        />
      )}
    </Box>
  );
};

export default Navbar;
