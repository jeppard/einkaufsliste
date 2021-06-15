import { Article } from './article';

export class ListElement {
    id: number;
    listID: number;
    article: Article;
    count: number;
    unitType: string;

    constructor (id: number, listID: number, article: Article, count: number, unitType: string) {
        this.id = id;
        this.listID = listID;
        this.article = article;
        this.count = count;
        this.unitType = unitType;
    }
}
