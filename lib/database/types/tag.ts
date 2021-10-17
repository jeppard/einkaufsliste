export class Tag {
    public id: number;
    public listID: number;
    public name: string;

    constructor (id: number, listID: number, name: string) {
        this.id = id;
        this.listID = listID;
        this.name = name;
    }
}
