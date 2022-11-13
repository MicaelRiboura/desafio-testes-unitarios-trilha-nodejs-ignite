import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { OperationType } from '../../entities/Statement';
import { CreateStatementError } from './CreateStatementError';


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;


describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@mail.com",
      password: "123456789",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "Description",
    });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to create a new statement if user not exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "1234",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "Description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement if type is withdraw and amount is greater than balance", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@mail.com",
      password: "123456789",
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "Description",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
