export class Task{
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public date: string,
        public user_id: number
    ){}
}