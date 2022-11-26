import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import {
  UserInput,
  UsernamePasswordInput,
  UserResponse,
  FieldError,
} from "../types";

//don't forget to come back  and trying again argon2 and bcrypt which didn't work for password field
@Resolver()
export class userResolver {
  @Mutation(() => UserResponse)
  async register(@Arg("input") input: UserInput): Promise<UserResponse | User> {
    let regex = /[A-Z]*[0-9]/;
    let mailRegex = /[@]/;
    const username = input.username;
    const registredUser = await User.findOne({
      where: { username },
    });
    // console.log("-----   ------");

    // console.log(registredUser);

    // console.log("-----   ------");

    if (!!registredUser) {
      return {
        errors: [
          {
            field: "username",
            message: "this username is already in our dataset",
          },
        ],
      };
    }
    if (input.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "your username is too small",
          },
        ],
      };
    }

    if (input.email === "" || !mailRegex.test(input.email)) {
      return {
        errors: [
          {
            field: "email",
            message: "your email can't be empty",
          },
        ],
      };
    }

    if (input.firstname === "") {
      return {
        errors: [
          {
            field: "firstname",
            message: "your firstname can't be empty",
          },
        ],
      };
    }

    if (input.lastname === "") {
      return {
        errors: [
          {
            field: "lastname",
            message: "your lastname can't be empty",
          },
        ],
      };
    }
    console.log("regex-test");
    console.log(input.password);

    console.log(regex.test(input.password));
    console.log("end regex-test");

    if (
      input.password.length < 6 ||
      input.password === input.username ||
      !regex.test(input.password)
    ) {
      return {
        errors: [
          {
            field: "password",
            message:
              "your password should be greater than 5 character and should have at least One capital letter and atone number",
          },
        ],
      };
    }

    const newUser = await User.create({
      username: input.username,
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      password: input.password,
    }).save();

    return {
      user: newUser,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("login_credentials") credentials: UsernamePasswordInput
  ): Promise<User | UserResponse> {
    const member = await User.findOne({
      where: { username: credentials.username, password: credentials.password },
    });

    if (!member) {
      return {
        errors: [
          {
            field: "credentials",
            message: "your credentials don't match with any of our users",
          },
        ],
      };
    }

    return {
      user: member,
    };
  }

  @Query(() => User, { nullable: true })
  async getByUsername(
    @Arg("username") username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }
}
