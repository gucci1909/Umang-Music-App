import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../Redux/SignupRedux/signup.actions";

function Signup() {
  const InitialState = {
    username: "",
    password: "",
    emailID: "",
    phone: 0,
  };
  const [state, setState] = useState(InitialState);
  const [write, setWrite] = useState(false);
  console.log(state);
  const navigate = useNavigate();
  const { success, loading, error } = useSelector((store) => store.signup);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = (e, state) => {
    e.preventDefault();
    if (state.username === "") {
      setWrite(true);
    } else if (state.password === "") {
      setWrite(true);
    } else if (state.emailID === "") {
      setWrite(true);
    } else if (state.phone === "") {
      setWrite(true);
    } else {
      const value = {
        username: state.username,
        password: state.password,
        emailID: state.emailID,
        phone: state.phone,
        userType: "user",
      };
      console.log(value);
      setState(InitialState);
      dispatch(signup(value));
    }
  };
  if (success) {
    setTimeout(() => {
      return navigate("/login");
    }, 2000);
    return (
      <Alert
        status="success"
        h={"50px"}
        w={"400px"}
        textAlign={"center"}
        borderRadius={"10px"}
        ml="auto"
        mr={"auto"}
      >
        <AlertIcon />
        Your Account has been successfully created
      </Alert>
    );
  }

  const showWrite = () => {
    setTimeout(() => {
      setWrite(false);
    }, 2000);
    if (write) {
      return (
        <Alert
          status="warning"
          h={"50px"}
          w={"400px"}
          textAlign={"center"}
          borderRadius={"10px"}
          ml="auto"
          mr={"auto"}
        >
          <AlertIcon />
          Write All Details !
        </Alert>
      );
    } else {
      return "";
    }
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
        mr={"auto"}
      >
        <AlertIcon />
        Username or Email already exists
      </Alert>
    );
  };

  return (
    <Box
      h="630px"
      w="auto"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      bgImage="url('https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb')"
    >
      <Box>
        {error ? showAlert() : ""}
        {write ? showWrite() : ""}
      </Box>
      <Heading
        textAlign={"center"}
        fontSize="45px"
        color={"white"}
        fontFamily="Gill Sans, sans-serif"
        paddingTop={"20px"}
      >
        Create Your Account
      </Heading>
      <FormControl textAlign={"center"} isRequired>
        <FormLabel color={"pink"} ml="590px" mt="30px">
          USERNAME
        </FormLabel>
        <Input
          w="350px"
          color="darkBlue"
          bgColor={"lightPink"}
          _placeholder={{ color: "inherit" }}
          type={"text"}
          value={state.username}
          name="username"
          onChange={(e) => handleChange(e)}
          placeholder="Username"
        ></Input>
        <FormLabel color={"pink"} ml="590px" mt="15px">
          PASSWORD
        </FormLabel>
        <Input
          w="350px"
          color="darkBlue"
          bgColor={"lightPink"}
          _placeholder={{ color: "inherit" }}
          type={"password"}
          value={state.password}
          name="password"
          onChange={(e) => handleChange(e)}
          placeholder="Password"
        ></Input>
        <FormLabel color={"pink"} ml="590px" mt="15px">
          EMAIL-ID
        </FormLabel>
        <Input
          w="350px"
          color="darkBlue"
          bgColor={"lightPink"}
          _placeholder={{ color: "inherit" }}
          type={"email"}
          value={state.emailID}
          name="emailID"
          onChange={(e) => handleChange(e)}
          placeholder="Email-ID"
        ></Input>
        <FormLabel color={"pink"} ml="590px" mt="15px">
          PHONE
        </FormLabel>
        <Input
          w="350px"
          color="darkBlue"
          bgColor={"lightPink"}
          _placeholder={{ color: "inherit" }}
          type={"number"}
          value={state.phone}
          name="phone"
          onChange={(e) => handleChange(e)}
          placeholder="Phone No."
        ></Input>
      </FormControl>
      <Button
        ml="720px"
        mt="30px"
        colorScheme={"facebook"}
        isLoading={loading}
        onClick={(e) => handleSubmit(e, state)}
      >
        Sign Up
      </Button>
    </Box>
  );
}

export default Signup;
