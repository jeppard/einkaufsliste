import { ArticleType } from './aritcle_type';

export class Article {
    id: number;
    listID: number;
    name: string;
    description: string;
    type: ArticleType;

    /**
     * Create new article
     * @param id Specific ID of the article
     * @param listID ID of the list which owns this article
     * @param name Name of the article
     * @param description description of the article
     * @param type Type number of the article
     */
    constructor (id: number, listID: number, name: string, description: string, type: ArticleType) {
        this.id = id;
        this.listID = listID;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}
