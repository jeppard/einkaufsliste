import { ListElement } from './list_element';

export class List {
    id: number;
    name: string;
    ownerID: string;
    description: string;
    content: ListElement[];

    constructor (id: number, name: string, ownerid: string, description: string, content: ListElement[]) {
        this.id = id;
        this.name = name;
        this.ownerID = ownerid;
        this.description = description;
        this.content = content;
    }
}
