/**
 * News class to store news data
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default class News {
    title: string = '';
    source_name: string = '';
    author: string = '';
    description: string = '';
    url: string = '';
    published_at: Date | null = null;


    setTitle(title: string) {
        this.title = title;
    }

    setSourceName(source_name: string) {
        this.source_name = source_name;
    }

    setAuthor(author: string) {
        this.author = author;
    }

    setDescription(description: string) {
        this.description = description;
    }

    setUrl(url: string) {
        this.url = url;
    }

    setPublishedAt(published_at: Date) {
        this.published_at = published_at;
    }
}

