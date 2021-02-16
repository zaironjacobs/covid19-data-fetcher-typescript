import {MongoClient, Collection, Db} from 'mongodb';

const mongoOptions = {useUnifiedTopology: true};


/**
 * MongoDB
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default class MongoDatabase {
    client: MongoClient;
    countryCollection!: Collection;
    newsCollection!: Collection;
    db!: Db;

    constructor() {
        this.client = new MongoClient(process.env.CONNECTION_STRING, mongoOptions);
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
     * Insert data into the news collection
     *
     * @param {array} data
     */
    async insertNews(data: {}): Promise<void> {
        await this.newsCollection.insertOne(data);
    }

    /**
     * Connect to the client
     */
    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db(process.env.DATABASE);
            this.countryCollection = await this.db.collection(process.env.COLLECTION_COUNTRY);
            this.newsCollection = await this.db.collection(process.env.COLLECTION_NEWS);
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
     * Drop the news collection from the MongoDB database
     */
    async dropNewsCollection(): Promise<void> {
        try {
            await this.newsCollection.drop();
        } catch {
            // ignore
        }
    }
}