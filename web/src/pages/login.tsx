import { NextPage } from "next";
import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { Box, Button } from "@chakra-ui/react";
import { InputField } from "../components/InputField";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useLoginMutation, User } from "../generated/graphql";
import { useRouter } from "next/router";
import { useState } from "react";
import classes from "./login.module.css";
interface ILoginProps {}

const Login: NextPage<ILoginProps> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  //let current_user: User | undefined | boolean;
  const [current_user, setCuurent_user] = useState(true);
  return (
    <Wrapper variant="small">
      {!current_user && (
        <p className={classes["error-style"]}>
          We're sorry guys your credentials don't match with any of our users
        </p>
      )}
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values) => {
          const response = await login({ login_credentials: values });
          console.log(response);
          console.log(response.data?.login.user);

          if (!response.data?.login.user) {
            setCuurent_user(false);

            console.log("je suis ici");

            return;
          }
          if (response.data?.login.user) {
            const right_user = response.data?.login.user;
            router.push(`user/${right_user.username}`);
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
