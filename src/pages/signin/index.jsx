import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import CustomButton from "../../components/CustomButton";
import { signin } from "./helper";
import { authenticate, isAuthenticate, setLocalUser } from "../../helper/auth";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
    loading: false,
    error: false,
    success: false,
  });
  const { email, password, loading } = values;

  // Input Changer
  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
      loading: false,
      error: false,
      success: false,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false, success: false });

    signin({ email, password }).then((response) => {
      if (!response.data) {
        setValues({ ...values, loading: false, error: true, success: false });
        return toast(response.error.message || "Something went wrong", {
          type: "error",
          theme: "colored",
          autoClose: 2000,
        });
      } else {
        setValues({ ...values, loading: false, error: false, success: true });
        toast("Successfully sign in ", {
          type: "success",
          theme: "colored",
          autoClose: 5000,
        });
        authenticate(response.data?.sign_in);
        setLocalUser(response.data?.user);
        navigate("/");
        // window.location.reload();
      }
    });
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      {isAuthenticate() && <Navigate to={"/"} />}
      <Stack spacing={8} mx={"auto"} w="lg" py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={handleChange("email")}
                  value={email}
                  disabled={loading}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange("password")}
                    value={password}
                    autoComplete="on"
                    disabled={loading}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={5}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <Checkbox disabled={loading}>Remember me</Checkbox>
                  <Link
                    as={NavLink}
                    to="/account/forgotpassword"
                    color={"blue.400"}
                  >
                    Forgot password?
                  </Link>
                </Stack>
                <CustomButton
                  type="submit"
                  isLoading={loading}
                  spinnerPlacement="end"
                  loadingText="Submiting"
                >
                  Sigin in
                </CustomButton>
              </Stack>
              <Text>
                Don't have any account?{" "}
                <Link as={NavLink} to="/e/signup" color={"blue.400"}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
