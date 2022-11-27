import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useGetByUsernameQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Flex } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";
import { Fragment } from "react";

const User: NextPage = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const [{ data, error, fetching }] = useGetByUsernameQuery({
    variables: { username },
  });
  const email = data?.getByUsername?.email;
  const firstname = data?.getByUsername?.firstname;
  const lastname = data?.getByUsername?.lastname;

  const zeMovieButtonPageHandler = () => {
    router.push("/play");
  };

  if (fetching) {
    return (
      <Flex alignItems="center" h="100vh" justifyContent="center">
        loading...
      </Flex>
    );
  } else if (error) {
    return (
      <Flex alignItems="center" h="100vh" justifyContent="center">
        {" "}
        an error occurered when fetching
      </Flex>
    );
  } else {
    return (
      <Fragment>
        <Flex
          alignItems="center"
          h="40vh"
          justifyContent="center"
          fontWeight="bold"
          fontSize="5xl"
          flexDirection="column"
        >
          <p>
            Oh Sorry! {firstname} {lastname} so it was you.
          </p>
          <p> Want to play a game?</p>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          fontSize="5xl"
        >
          <Button
            onClick={zeMovieButtonPageHandler}
            colorScheme="pink"
            variant="outline"
            size="lg"
          >
            Access to Zemovie Game
          </Button>
        </Flex>
      </Fragment>
    );
  }
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
