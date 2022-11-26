import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRegisterMutation } from "../generated/graphql";
import Link from "next/link";

interface IRegisterProps {}

const Register: NextPage<IRegisterProps> = () => {
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          lastname: "",
          firstname: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ input: values });
          // const user = response.data?.register;
          // if (user) {
          //   router.push(`user/${user.username}`);
          // }

          console.log(response);
          if (!response.data) {
            setErrors({
              username: "this field can't be empty",
              email: "this field can't be empty",
              password: "this field can't be empty",
              lastname: "this field can't be empty",
              firstname: "this field can't be empty",
            });
          }
          if (response.data?.register.errors[0].field) {
            const field = response.data?.register.errors[0].field;
            const message = response.data?.register.errors[0].message;
            switch (field) {
              case "username":
                setErrors({
                  username: message,
                });
                break;
              case "email":
                setErrors({
                  email: message,
                });
                break;
              case "firstname":
                setErrors({
                  firstname: message,
                });
                break;
              case "lastname":
                setErrors({
                  lastname: message,
                });
                break;
              case "password":
                setErrors({
                  password: message,
                });
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="email"
                placeholder="enter your mail"
                label="Email"
                type="email"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="firstname"
                placeholder="enter your firstname"
                label="firstname"
                type="text"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="lastname"
                placeholder="enter your lastname"
                label="lastname"
                type="text"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="your password"
                label="password"
                type="password"
              />
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
      <Link href="">I have an account login</Link>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
