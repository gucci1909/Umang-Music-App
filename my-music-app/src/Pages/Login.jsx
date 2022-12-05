import React, { useEffect } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  google_login,
  post_login,
  verification,
} from "../Redux/LoginRedux/login.actions";
import { Link, Navigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const [getShow, setGetShow] = useState(false);
  const InitialState = {
    username: "",
    password: "",
  };
  const { error, loading, isAuth, userType, _id } = useSelector(
    (store) => store.login
  );
  console.log(error, loading, isAuth, userType, _id);
  const [input, setInput] = useState(InitialState);
  const [isError, setIsError] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.username === "") {
      setIsError(true);
    }
    if (input.password === "") {
      setIsErrorPassword(true);
    } else {
      const value = {
        username: input.username,
        password: input.password,
      };
      dispatch(post_login(value));
      setInput(InitialState);
    }
  };

  const handleChange = (e) => {
    if (input.username.length >= 0) {
      setIsError(false);
    }
    if (input.password >= 0) {
      setIsErrorPassword(false);
    }
    let { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleGoogle = () => {
    window.open("http://localhost:8080/auth/google", "_self");
  };

  useEffect(() => {
    dispatch(verification());
    dispatch(google_login());
  }, [dispatch]);

  const handleShow = () => {
    setGetShow(!getShow);
  };

  const showAlert = () => {
    return (
      <Alert
        status="error"
        h={"50px"}
        w={"400px"}
        textAlign={"center"}
        borderRadius={"10px"}
        ml="auto"
        mr={"540px"}
      >
        <AlertIcon />
        Username or Password is incorrect
      </Alert>
    );
  };

  if (userType === "admin") {
    return <Navigate to="/songsCrud" />;
  }
  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      h="630px"
      w="auto"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      bgImage="url('https://images.pexels.com/photos/247676/pexels-photo-247676.jpeg?auto=compress&cs=tinysrgb')"
    >
      <Box>{error ? showAlert() : ""}</Box>
      <Box>
        <Heading
          textAlign={"center"}
          fontSize="45px"
          color={"#4299E1"}
          fontFamily="Gill Sans, sans-serif"
          paddingTop={"20px"}
        >
          Login
        </Heading>
        <FormControl
          mt="80px"
          textAlign={"center"}
          isRequired
          isInvalid={isError}
        >
          <FormLabel ml="-250px" color={"#4299E1"} textAlign={"center"}>
            Username
          </FormLabel>
          <Input
            isDisabled={loading}
            type="text"
            w="350px"
            color="darkBlue"
            autoComplete="off"
            placeholder="Enter Your Username"
            bgColor={"lightskyblue"}
            _placeholder={{ color: "inherit" }}
            value={input.username}
            name="username"
            onChange={(e) => handleChange(e)}
          />
          {!isError ? (
            ""
          ) : (
            <FormErrorMessage ml="590px">
              Username is required.
            </FormErrorMessage>
          )}
          <FormLabel
            mt="40px"
            color={"#4299E1"}
            ml="-250px"
            textAlign={"center"}
          >
            Password
          </FormLabel>
          <Box display={"flex"} ml="585px" gap="20px">
            <Input
              isDisabled={loading}
              w="350px"
              color="darkBlue"
              autoComplete="off"
              bgColor={"lightskyblue"}
              type={getShow ? "text" : "password"}
              value={input.password}
              placeholder="Enter Your Password"
              _placeholder={{ color: "inherit" }}
              name="password"
              onChange={(e) => handleChange(e)}
            ></Input>
            <Button w="70px" colorScheme={"blue"} onClick={() => handleShow()}>
              {getShow ? "Hide" : "Show"}
            </Button>
          </Box>

          {isErrorPassword === true ? (
            <FormErrorMessage ml="590px">Password is Required</FormErrorMessage>
          ) : (
            ""
          )}
          <Button
            colorScheme={"red"}
            mt="20px"
            isLoading={loading}
            onClick={(e) => handleSubmit(e)}
          >
            Login
          </Button>
          <Link to="/email">
            <Text color={"lightBlue"} mt="10px">
              Forgot Password ?
            </Text>
          </Link>
        </FormControl>
        <Box>
          <Center>
            <Button
              w={"200px"}
              mt={"20px"}
              onClick={() => handleGoogle()}
              colorScheme="gray"
              leftIcon={<FcGoogle />}
            >
              <Center>
                <Text>Sign in with Google</Text>
              </Center>
            </Button>
          </Center>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
