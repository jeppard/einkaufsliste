import { Article } from './article';
import { Tag } from './tag';

export class ListElement {
    id: number;
    listID: number;
    article: Article;
    count: number;
    unitType: string;
    tags: Tag[]

    constructor (id: number, listID: number, article: Article, count: number, unitType: string, tags: Tag[]) {
        this.id = id;
        this.listID = listID;
        this.article = article;
        this.count = count;
        this.unitType = unitType;
        this.tags = tags;
    }
}
