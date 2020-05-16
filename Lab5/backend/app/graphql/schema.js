const schema = `
type User {
    id: ID!
    login: String
    password: String
    token: String
}
type Task {
    id: ID!
    name: String
    date: String
    description: String
    user_id: ID!
}
type Query {
    Task(id: ID!):Task
    Tasks(user_id: ID!): [Task]
}
type Mutation {
    registration(userName: String, password: String) : User
    login(userName: String, password: String) : User
}
`;

module.exports.Schema = schema;