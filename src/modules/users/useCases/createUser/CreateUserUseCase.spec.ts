import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;


describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      usersRepositoryInMemory
    );
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@mail.com",
      password: "123456789",
    });

    expect(user).toHaveProperty("id");
  });

  it("should not be able to create a new user if email already exists", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User1",
        email: "user1@mail.com",
        password: "123456789",
      });

      await createUserUseCase.execute({
        name: "User2",
        email: "user1@mail.com",
        password: "123456789",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
