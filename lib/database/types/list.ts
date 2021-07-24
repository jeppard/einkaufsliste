import { ListElement } from './list_element';

export class List {
    id: number;
    name: string;
    ownerid: number;
    description: string;
    content: ListElement[];

    constructor (id: number, name: string, ownerid: number, description: string, content: ListElement[]) {
        this.id = id;
        this.name = name;
        this.ownerid = ownerid;
        this.description = description;
        this.content = content;
    }
}
