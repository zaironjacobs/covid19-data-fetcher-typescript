import {MongoClient, Collection, Db} from 'mongodb';


/**
 * MongoDB
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default class MongoDatabase {
    client: MongoClient;
    countryCollection!: Collection;
    articleCollection!: Collection;
    db!: Db;

    constructor() {
        this.client = new MongoClient(process.env.CONNECTION_STRING);
    }

    /**
     * Insert data into the country collection
     *
     * @param {array} data
     */
    async insertCountry(data: {}): Promise<void> {
        await this.countryCollection.insertOne(data);
    }

    /**
     * Insert data into the article collection
     *
     * @param {array} data
     */
    async insertArticle(data: {}) {
        await this.articleCollection.insertOne(data);
    }

    /**
     * Connect to the client
     */
    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(process.env.DATABASE);
            this.countryCollection = await this.db.collection(process.env.COLLECTION_COUNTRY);
            this.articleCollection = await this.db.collection(process.env.COLLECTION_ARTICLE);
        } catch {
            console.log('Could not connect to MongoDB database');
        }
    }

    /**
     * Close the client
     */
    async close(): Promise<void> {
        await this.client.close();
    }

    /**
     * Drop the country collection from the MongoDB database
     */
    async dropCountryCollection(): Promise<void> {
        try {
            await this.countryCollection.drop();
        } catch {
            // ignore
        }
    }

    /**
     * Drop the article collection from the MongoDB database
     */
    async dropArticleCollection(): Promise<void> {
        try {
            await this.articleCollection.drop();
        } catch {
            // ignore
        }
    }
}