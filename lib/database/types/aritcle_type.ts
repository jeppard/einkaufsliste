export class ArticleType {
    id: number;
    listID: number;
    name: string;
    color: string;

    constructor (id: number, listID: number, name: string, color: string) {
        this.id = id;
        this.listID = listID;
        this.name = name;
        this.color = color;
    }
}
