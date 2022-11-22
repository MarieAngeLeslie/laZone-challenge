import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface IRegisterProps {}

const Register: NextPage<IRegisterProps> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "Enter your name", email: "" }}
        onSubmit={async (values) => {
          const response = await register({ input: values });
          // const user = response.data?.register;
          // if (user) { 
          //   router.push(`user/${user.username}`);
          // }
          console.log(values);
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
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Register);
