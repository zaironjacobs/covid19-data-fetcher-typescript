/**
 * Article class to store article data
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default class Article {
    title: string = '';
    source_name: string = '';
    author: string = '';
    description: string = '';
    url: string = '';
    published_at: Date | null = null;


    setTitle(title: string): void {
        this.title = title;
    }

    setSourceName(source_name: string): void {
        this.source_name = source_name;
    }

    setAuthor(author: string): void {
        this.author = author;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setUrl(url: string): void {
        this.url = url;
    }

    setPublishedAt(published_at: Date) {
        this.published_at = published_at;
    }
}

