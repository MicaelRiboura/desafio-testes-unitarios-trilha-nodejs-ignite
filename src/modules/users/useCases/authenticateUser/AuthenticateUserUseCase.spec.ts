import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@mail.com",
      password: "123456789",
    });

    const resp = await authenticateUserUseCase.execute({
      email: "user@mail.com",
      password: "123456789",
    });

    expect(resp).toHaveProperty("token");
    expect(resp).toHaveProperty("user");
    expect(resp.user).toHaveProperty("id");
  });

  it("should not be able to authenticate if an user not exists", async () => {
    const resp = authenticateUserUseCase.execute({
      email: "false@mail.com",
      password: "123456789",
    });

    expect(resp).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate if password is incorrect", async () => {
    await createUserUseCase.execute({
      name: "User",
      email: "user@mail.com",
      password: "123456789",
    });

    const resp = authenticateUserUseCase.execute({
      email: "user@mail.com",
      password: "123",
    });

    expect(resp).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
