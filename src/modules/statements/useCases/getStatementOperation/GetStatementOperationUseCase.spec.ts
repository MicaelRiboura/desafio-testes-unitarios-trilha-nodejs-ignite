import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { OperationType } from '../../entities/Statement';
import { GetStatementOperationError } from './GetStatementOperationError';


let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;


describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("should be able to get statement operation of an user", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@mail.com",
      password: "123456789",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 10,
      description: "Description",
      type: OperationType.DEPOSIT,
    });

    const statementOperation = await getStatementOperationUseCase
      .execute({ user_id: user.id!, statement_id: statement.id! });

    expect(statementOperation).toHaveProperty("id");
  });

  it("should not be able to get statement operation if user not exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase
        .execute({ user_id: "111", statement_id: "111" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation if statement with user not exists", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@mail.com",
      password: "123456789",
    });

    expect(async () => {
      await getStatementOperationUseCase
        .execute({ user_id: user.id!, statement_id: "111" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
