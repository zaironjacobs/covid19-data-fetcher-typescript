/**
 * Article interface
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default interface Article {
    title: string;
    source: {
        name: string;
    };
    author: string;
    description: string;
    url: string;
    publishedAt: Date;
}