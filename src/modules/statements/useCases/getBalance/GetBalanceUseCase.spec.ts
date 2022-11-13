import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { GetBalanceError } from './GetBalanceError';


let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;


describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to get balance of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@mail.com",
      password: "123456789",
    });

    const balance = await getBalanceUseCase.execute({ user_id: user.id! });

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get balance if user not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "1234" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
