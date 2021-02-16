/**
 * Country class to store data of a country
 *
 * @author      Zairon Jacobs <zaironjacobs@gmail.com>
 */
export default class Country {
    name: string = '';
    confirmed: number = 0;
    deaths: number = 0;
    active: number = 0;
    recovered: number = 0;
    last_updated_by_source_at: Date | null = null;


    setName(name: string): void {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    incrementConfirmed(confirmed: number): void {
        this.confirmed += confirmed;
    }

    incrementDeaths(deaths: number): void {
        this.deaths += deaths;
    }

    incrementActive(active: number): void {
        this.active += active;
    }

    incrementRecovered(recovered: number): void {
        this.recovered += recovered;
    }

    setLastUpdatedBySourceAt(lastUpdatedBySourceAt: Date | null): void {
        this.last_updated_by_source_at = lastUpdatedBySourceAt;
    }
}

