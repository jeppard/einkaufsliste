import { Article } from './article';

export class ListElement {
    listID: number;
    article: Article;
    count: number;
    unitType: string;

    constructor (listID: number, article: Article, count: number, unitType: string) {
        this.listID = listID;
        this.article = article;
        this.count = count;
        this.unitType = unitType;
    }
}
