export class Task{
    constructor(
        public id: number,
        public subject: string,
        public details: string,
        public deadline: string,
        public mark: number,
        public student: string
    ){}
}