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


    setName(name: string) {
        this.name = name;
    }

    getName(): string {
        return this.name;
    }

    incrementConfirmed(confirmed: number) {
        this.confirmed += confirmed;
    }

    incrementDeaths(deaths: number) {
        this.deaths += deaths;
    }

    incrementActive(active: number) {
        this.active += active;
    }

    incrementRecovered(recovered: number) {
        this.recovered += recovered;
    }

    setLastUpdatedBySourceAt(lastUpdatedBySourceAt: Date | null) {
        this.last_updated_by_source_at = lastUpdatedBySourceAt;
    }
}

