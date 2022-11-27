import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { useGetByUsernameQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Flex } from "@chakra-ui/react";
import { Box, Button } from "@chakra-ui/react";

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
    const router = useRouter();
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
      <Flex
        alignItems="center"
        h="100vh"
        justifyContent="center"
        fontWeight="bold"
        fontSize="5xl"
      >
        Y're Welcome {firstname} {lastname}
        <Button
          onClick={zeMovieButtonPageHandler}
          mt={10}
          colorScheme="pink"
          variant="outline"
        >
          Access to Zemovie Game
        </Button>
      </Flex>
    );
  }
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
