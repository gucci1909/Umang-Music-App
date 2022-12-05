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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Reset() {
  const InitialState = {
    otp: "",
    new_password: "",
  };
  const [timer, setTimer] = useState(59);
  const location = useLocation();
  console.log(location);
  const [loading, setLoading] = useState(false);
  const [getShow, setGetShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [state, setState] = useState(InitialState);

  const navigate = useNavigate();
  const countDown = () => {
    if (timer === 0) {
      return navigate("/email");
    }
    if (success) {
      return timer;
    } else {
      setTimeout(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleGetShow = () => {
    setGetShow(!getShow);
  };

  const handleSubmit = async (otp, password) => {
    if (otp === "") {
      return;
    }
    if (password === "") {
      return;
    } else {
      setLoading(true);

      try {
        const value = {
          otp: otp,
          emailID: location.state.emailID,
          new_password: password,
        };
        setState(InitialState);
        const res = await axios.put(`http://localhost:8080/otp/check`, value);
        const data = res.data;
        console.log(data);
        setSuccess(true);
        setState(InitialState);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        setIsError(true);
      }
    }
  };

  const showAlert = () => {
    setTimeout(() => {
      setIsError(false);
    }, 2000);
    if (isError) {
      return (
        <Alert
          status="error"
          h={"50px"}
          w={"400px"}
          textAlign={"center"}
          borderRadius={"10px"}
          ml="585px"
          mt="15px"
          mr={"auto"}
        >
          <AlertIcon />
          OTP is incorrect
        </Alert>
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
    countDown();
  }, [timer]);

  const successAlert = () => {
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
        ml="585px"
        mt="15px"
        mr={"auto"}
      >
        <AlertIcon />
        Your Password has been reset
      </Alert>
    );
  };
  return (
    <Box>
      <Heading
        textAlign={"center"}
        mt="10px"
        fontSize="25px"
        color={"#4299E1"}
        fontFamily="Gill Sans, sans-serif"
      >
        write your otp in
      </Heading>
      <Heading
        textAlign={"center"}
        fontSize="25px"
        mt="10px"
        color={"#4299E1"}
        fontFamily="Gill Sans, sans-serif"
      >
        {" "}
        00 : {timer}
      </Heading>

      {isError ? showAlert() : ""}
      {success ? successAlert() : ""}
      <FormControl textAlign={"center"} isRequired>
        <FormLabel mt="40px" textAlign={"center"} ml="-170px">
          Enter your 4-Digit OTP
        </FormLabel>
        <Input
          w="350px"
          type="text"
          name="otp"
          autoComplete="off"
          placeholder="Enter Your OTP"
          isDisabled={success}
          maxLength="4"
          value={state.otp}
          onChange={(e) => handleChange(e)}
        ></Input>
        <FormLabel mt="40px" ml="590px">
          Enter your new password
        </FormLabel>
        <Box display={"flex"} ml="592px" gap="20px">
          <Input
            w="350px"
            placeholder="Enter Your New Password"
            type={getShow ? "text" : "password"}
            name="new_password"
            autoComplete="off"
            value={state.new_password}
            isDisabled={success}
            onChange={(e) => handleChange(e)}
          ></Input>
          <Button w="60px" colorScheme={"blue"} onClick={() => handleGetShow()}>
            {getShow ? "Hide" : "Show"}
          </Button>
        </Box>
        <Button
          mt="30px"
          colorScheme={"green"}
          isLoading={loading}
          onClick={() => handleSubmit(state.otp, state.new_password)}
        >
          Change Password
        </Button>
      </FormControl>
    </Box>
  );
}

export default Reset;
