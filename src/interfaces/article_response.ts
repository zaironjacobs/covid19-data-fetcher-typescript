/**
 * Article response interface
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default interface ArticleResponse {
    title: string;
    source: {
        name: string;
    };
    author: string;
    description: string;
    url: string;
    publishedAt: Date;
}