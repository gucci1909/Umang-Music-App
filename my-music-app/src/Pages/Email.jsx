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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Email() {
  const InitialState = {
    emailID: "",
  };
  const [state, setState] = useState(InitialState);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = async (state) => {
    if (state.emailID === "") {
      return;
    } else {
      const value = {
        emailID: state.emailID,
      };
      setLoading(true);
      try {
        const res = await axios.post(`http://localhost:8080/otp/create`, value);
        const data = res.data;
        console.log(data);
        setSuccess(true);
        setLoading(false);
      } catch (error) {
        console.log("this email ID DOESN'T EXIST");
        setIsError(true);
        setLoading(false);
      }
    }
  };
  const showAlert = () => {
    setTimeout(() => {
      setIsError(false);
    }, 5000);
    if (isError) {
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
          Email does not exists
        </Alert>
      );
    } else {
      return "";
    }
  };
  console.log(state.emailID);
  if (success) {
    console.log(state.emailID);
    navigate("/reset", { state: { emailID: state.emailID } });
  }
  return (
    <Box>
      <Box mt={"10px"}>{isError ? showAlert() : ""}</Box>
      <Heading
        textAlign={"center"}
        fontSize="25px"
        lineHeight={"100px"}
        color={"#4299E1"}
        fontFamily="Gill Sans, sans-serif"
        paddingTop={"20px"}
      >
        We will sent you a 4-Digit OTP on your registered Email-Id for recovery
        of your password.
      </Heading>
      <FormControl textAlign={"center"} isRequired>
        <FormLabel ml="550px">Email-ID</FormLabel>
        <Input
          color="darkBlue"
          bgColor={"lightskyblue"}
          _placeholder={{ color: "inherit" }}
          w="450px"
          required
          type={"email"}
          autoComplete="off"
          placeholder="Write your email here"
          name="emailID"
          value={state.emailID}
          onChange={(e) => handleChange(e)}
        ></Input>
      </FormControl>
      <Button
        mt="20px"
        colorScheme={"red"}
        ml="730px"
        isLoading={loading}
        onClick={() => handleSubmit(state)}
      >
        Submit
      </Button>
    </Box>
  );
}

export default Email;
