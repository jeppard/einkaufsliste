import { Tag } from './tag';

export class Filter {
    id: number;
    listID: number
    name: string;
    color: string;
    tags: Tag[];

    constructor (id: number, listID:number, name: string, color:string, tags: Tag[]) {
        this.id = id;
        this.listID = listID;
        this.name = name;
        this.color = color;
        this.tags = tags;
    }
}
