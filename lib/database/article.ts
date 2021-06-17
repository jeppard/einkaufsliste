export class Article {
    id: number;
    userID: number;
    name: string;
    description: string;
    type: number;

    /**
     * Create new article
     * @param id Specific ID of the article
     * @param userID ID of the user who owns this article
     * @param name Name of the article
     * @param description description of the article
     * @param type Type number of the article
     */
    constructor (id: number, userID: number, name: string, description: string, type: number) {
        this.id = id;
        this.userID = userID;
        this.name = name;
        this.description = description;
        this.type = type;
    }
}
