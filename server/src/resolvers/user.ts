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
    const registredUser = User.findOne({
      where: { username: input.username },
    });
    if (!!registredUser) {
      return {
        errors: [
          {
            field: "username",
            message: "this username is already registered",
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
    if (input.password.length < 6 && input.password == input.username) {
      return {
        errors: [
          {
            field: "username",
            message: "your should have stronger password",
          },
        ],
      };
    }

    return User.create({
      username: input.username,
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      password: input.password,
    }).save();
  }

  @Mutation(() => User)
  async login(
    @Arg("login_credentials") credentials: UsernamePasswordInput
  ): Promise<User | UserResponse | undefined> {
    const member = User.findOne({
      where: { username: credentials.username, password: credentials.password },
    });

    if (!member) {
      return {
        errors: [
          {
            field: "credentials",
            message: "your credentials don't match with our dataset",
          },
        ],
      };
    }

    return member;
  }

  @Query(() => User, { nullable: true })
  async getByUsername(
    @Arg("username") username: string
  ): Promise<User | undefined> {
    return User.findOne({ where: { username } });
  }
}
