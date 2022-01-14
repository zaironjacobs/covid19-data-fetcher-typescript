import fs, {WriteStream} from 'fs'
import moment, {Moment} from 'moment'
import {sprintf} from 'sprintf-js'
import path from 'path'
import axios, {AxiosResponse} from 'axios'
import csvtojson from 'csvtojson'

import Constants from './constants'
import Country from './models/country'
import Article from './models/article'
import ArticleResponse from './interfaces/article_response'
import MongoDatabase from './mongoDatabase'


/**
 * Fetch and save data of each country to a MongoDB database.
 * Fetch and save articles related to COVID-19 to a MongoDB database.
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default class App {
    csvFileName: string
    csvRows: any[]
    countryObjects: { [key: string]: Country }
    articleObjects: Article[]

    totalDeaths: number
    totalActive: number
    totalRecovered: number
    totalConfirmed: number

    mongoDatabase: MongoDatabase

    constructor() {
        this.csvFileName = ''

        this.csvRows = []
        this.countryObjects = {}
        this.articleObjects = []

        this.totalDeaths = 0
        this.totalActive = 0
        this.totalRecovered = 0
        this.totalConfirmed = 0

        this.mongoDatabase = new MongoDatabase()
    }

    /**
     * Main function for initialization
     */
    async init(): Promise<void> {
        console.log('Downloading data...')
        await this.downloadCsvFile()
        await this.fetchArticles()

        console.log('Saving data to database...')
        await this.setRowsData()
        this.createCountryObjects()
        this.populateCountryObjects()
        await this.mongoDatabase.connect()
        await this.saveArticleDataToDb()
        await this.saveCountryDataToDb()
        await this.mongoDatabase.close()

        console.log('Finished')
    }

    /**
     * Download any file to the data dir
     */
    async download(url: string): Promise<void> {
        const pathDataFile: string = path.dirname(__filename) + '/' + Constants.DATA_DIR + '/' + this.csvFileName
        const writer: WriteStream = fs.createWriteStream(pathDataFile)

        const response: AxiosResponse<any> = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })

        response.data.pipe(writer)


        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    }

    /**
     * Download the csv file
     */
    async downloadCsvFile(): Promise<void> {
        const pathDataDir: string = path.dirname(__filename) + '/' + Constants.DATA_DIR
        if (fs.existsSync(pathDataDir)) {
            try {
                fs.rmSync(pathDataDir, {recursive: true})
            } catch (err) {
                console.error(err)
            }
        }
        fs.mkdirSync(pathDataDir)

        const tries: number = 90
        for (let i: number = 0; i < tries; i++) {
            const date_string: string = moment().subtract(i, 'days').format('MM-DD-YYYY')
            this.csvFileName = date_string + '.csv'
            const url: string = sprintf(Constants.DATA_URL, this.csvFileName)

            try {
                return await this.download(url)
            } catch {
                const pathFileToDelete: string = path.dirname(__filename) + '/' + Constants.DATA_DIR
                    + '/' + this.csvFileName
                fs.unlinkSync(pathFileToDelete)
            }
        }
        console.log('Download failed: Unable to find the latest csv file for the last ' + tries + ' days')
    }

    /**
     * Return an array with all country names
     *
     * @return {array}
     */
    getCountryNamesArray(): string[] {
        let countryNames: string[] = []
        this.csvRows.forEach(row => {
            countryNames.push(row[Constants.COL_COUNTRY])
        })
        countryNames.push(Constants.WORLDWIDE)
        return [...new Set(countryNames)]
    }

    /**
     * Create country objects of all countries
     */
    createCountryObjects(): void {
        const countryNames: string[] = this.getCountryNamesArray()
        const lastUpdatedBySourceTime: Date = this.getLastUpdatedBySourceTime()
        countryNames.forEach(countryName => {
            const country: Country = new Country()
            country.setName(countryName)
            country.setLastUpdatedBySourceAt(lastUpdatedBySourceTime)
            this.countryObjects[country.getName()] = country
        })
    }

    /**
     * Retrieve all rows from the csv file inside the data dir
     */
    async setRowsData(): Promise<void> {
        const pathDataFile: string = path.dirname(__filename) + '/' + Constants.DATA_DIR + '/' + this.csvFileName
        this.csvRows = await csvtojson().fromFile(pathDataFile)
    }

    /**
     * Populate all country objects with data retrieved from the csv file
     */
    populateCountryObjects(): void {

        function getCaseCount(row: any, columnName: string): number {
            let caseValue: number = parseInt(row[columnName])
            if (isNaN(caseValue)) {
                caseValue = 0
            }
            if (caseValue < 0) {
                caseValue = Math.abs(caseValue)
            }
            return caseValue
        }

        this.csvRows.forEach(row => {
                const countryName: string = row[Constants.COL_COUNTRY]

                const deaths: number = getCaseCount(row, Constants.COL_DEATHS)
                this.totalDeaths += deaths

                const confirmed: number = getCaseCount(row, Constants.COL_CONFIRMED)
                this.totalConfirmed += confirmed

                const active: number = getCaseCount(row, Constants.COL_ACTIVE)
                this.totalActive += active

                const recovered: number = getCaseCount(row, Constants.COL_RECOVERED)
                this.totalRecovered += recovered

                const country: Country = this.countryObjects[countryName]
                country.incrementDeaths(deaths)
                country.incrementConfirmed(confirmed)
                country.incrementActive(active)
                country.incrementRecovered(recovered)
            }
        )

        const countryWorldwide: Country = this.countryObjects[Constants.WORLDWIDE]
        countryWorldwide.incrementDeaths(this.totalDeaths)
        countryWorldwide.incrementConfirmed(this.totalConfirmed)
        countryWorldwide.incrementActive(this.totalActive)
        countryWorldwide.incrementRecovered(this.totalRecovered)
    }

    /**
     * Return the last updated time of the data
     *
     * @return {Date}
     */
    getLastUpdatedBySourceTime(): Date {
        const dateString: string = this.csvRows[0][Constants.COL_LAST_UPDATE]
        const dateMoment: Moment = moment(dateString)
        return new Date(Date.UTC(
            dateMoment.year(), dateMoment.month(), dateMoment.date(),
            dateMoment.hours(), dateMoment.minute(), dateMoment.second()))
    }

    /**
     * Fetch articles and save them to an array
     */
    async fetchArticles(): Promise<void> {
        const url: string = sprintf(Constants.NEWS_API_URL, process.env.NEWS_API_KEY, process.env.NEWS_PAGE_SIZE)
        let articleObjects: Article[] = []

        await axios.get(url)
            .then(function (response: AxiosResponse<any>) {
                const articles: [] = response.data['articles']

                articles.forEach((articleResponse: ArticleResponse) => {
                    const articleObj: Article = new Article()

                    let title: string = '-'
                    if (articleResponse.title !== null) {
                        title = articleResponse.title
                    }
                    articleObj.setTitle(title)

                    let sourceName: string = '-'
                    if (articleResponse.source.name !== null) {
                        sourceName = articleResponse.source.name
                    }
                    articleObj.setSourceName(sourceName)

                    let author: string = '-'
                    if (articleResponse.author !== null) {
                        author = articleResponse.author
                    }
                    articleObj.setAuthor(author)

                    let description: string = '-'
                    if (articleResponse.description !== null) {
                        description = articleResponse.description
                    }
                    articleObj.setDescription(description)

                    let url: string = '-'
                    if (articleResponse.url !== null) {
                        url = articleResponse.url
                    }
                    articleObj.setUrl(url)

                    const date_moment: Moment = moment(articleResponse.publishedAt)
                    const publishedAt: Date = new Date(Date.UTC(
                        date_moment.year(), date_moment.month(), date_moment.date(),
                        date_moment.hours(), date_moment.minute(), date_moment.second()))
                    articleObj.setPublishedAt(publishedAt)

                    articleObjects.push(articleObj)
                })
            })
            .catch(function () {
                console.log('Error: could not fetch articles')
            })

        this.articleObjects = articleObjects
    }

    /**
     * Save each country object to a MongoDB database
     */
    async saveCountryDataToDb(): Promise<void> {
        await this.mongoDatabase.dropCountryCollection()
        const values: Country[] = Object.values(this.countryObjects)
        for (const value of values) {
            await this.mongoDatabase.insertCountry(value)
        }
    }

    /**
     * Save each article object to a MongoDB database
     */
    async saveArticleDataToDb(): Promise<void> {
        await this.mongoDatabase.dropArticleCollection()
        const values: Article[] = this.articleObjects
        for (const value of values) {
            await this.mongoDatabase.insertArticle(value)
        }
    }
}
