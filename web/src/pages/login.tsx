import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";

interface ILoginProps {}

const Login: NextPage<ILoginProps> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ login_credentials: values });
          console.log(values);
          console.log(response);
          const user = response.data?.login.user;
          if (user) {
            router.push(`user/${user.username}`);
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
              <InputField name="password" label="Password" type="password" />
            </Box>
            <Button
              type="submit"
              mt={4}
              isLoading={isSubmitting}
              colorScheme="blue"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Login);
