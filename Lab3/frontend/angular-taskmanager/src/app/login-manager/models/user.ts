export class User {
    constructor(
        public id: number,
        public login: string,
        public password: string,
        public token?: string,
    ){}
}