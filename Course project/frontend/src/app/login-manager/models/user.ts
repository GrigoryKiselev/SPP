export class User {
    constructor(
        public id: number,
        public login: string,
        public password: string,
        public role: string,
        public token?: string,
    ){}
}