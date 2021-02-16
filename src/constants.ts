export default class Constants {
    public static readonly DATA_DIR: string = 'data';
    public static readonly DATA_URL: string = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/%s';
    public static readonly NEWS_API_URL: string = 'https://newsapi.org/v2/everything?qInTitle=covid+OR+corona&apiKey=%s&language=en&sortBy=publishedAt&pageSize=%s';
    public static readonly COL_LAST_UPDATE: string = 'Last_Update';
    public static readonly COL_COUNTRY: string = 'Country_Region';
    public static readonly COL_DEATHS: string = 'Deaths';
    public static readonly COL_CONFIRMED: string = 'Confirmed';
    public static readonly COL_ACTIVE: string = 'Active';
    public static readonly COL_RECOVERED: string = 'Recovered';
    public static readonly WORLDWIDE: string = 'Worldwide';
}