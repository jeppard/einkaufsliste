export class Article {
    id: number;
    userID: number;
    name: string;
    description: string;
    type: number;

    constructor (id: number, userID: number, name: string, description: string, type: number) {
        this.id = id;
        this.userID = userID;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}
