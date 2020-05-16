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
    GetTask(id: ID!):Task
    GetTasks(user_id: ID!): [Task]
}
type Mutation {
    registration(login: String, password: String) : User
    login(userName: String, password: String) : User    
    addTask(name: String, date: String, description: String, user_id: ID!) : Task
    updateTask(id: ID!, name: String, date: String, details: String, user_id: ID!) : Task
    deleteTask(id: ID!): Task
}
`;

module.exports.Schema = schema;