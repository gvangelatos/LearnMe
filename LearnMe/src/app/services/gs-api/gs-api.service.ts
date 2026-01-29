import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  defaultIfEmpty,
  defer,
  filter,
  map,
  Observable,
  repeat,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { WordCardModel } from '../../swiper-tab/tab1.models';

@Injectable({
  providedIn: 'root',
})
export class GsApiService {
  private readonly http = inject(HttpClient);
  private readonly MAX_RETRIES = 50;

  getAllData() {
    return this.http
      .get(
        'https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/export?format=csv',
        { responseType: 'text' },
      )
      .pipe(map((csv) => this.csvToJson(csv)));
  }

  private csvToJson(csv: string) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((obj: any, header, i) => {
        obj[header.trim()] = values[i]?.trim();
        return obj;
      }, {});
    });
  }

  private getMaxId() {
    const query = `
    SELECT A
    ORDER BY A DESC
    LIMIT 1
  `;

    const url =
      'https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?' +
      'tq=' +
      encodeURIComponent(query);

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((text) => {
        const json = JSON.parse(text.substring(47, text.length - 2));
        return json.table.rows[0]?.c[0]?.v ?? null;
      }),
    );
  }

  getRandomWords(
    existingIds?: number[],
    count: number = 6,
  ): Observable<WordCardModel[]> {
    return this.getMaxId().pipe(
      switchMap((maxId) => {
        return this.getSpecificWordsData(
          this.getRandomNumbersInRange(0, maxId, count, existingIds ?? []),
          count,
        );
      }),
    );
  }

  getRandomWordWithArticle(): Observable<WordCardModel[]> {
    return this.getMaxId().pipe(
      switchMap((maxId) => {
        return defer(() => this.fetchRandomOnce(maxId)).pipe(
          repeat({ count: this.MAX_RETRIES }),
          filter((words) => words.length > 0),
          take(1),
          defaultIfEmpty([]),
        );
      }),
    );
  }

  getRandomWordsWithArticle(numberOfWords: number = 1): Observable<any> {
    return this.fetchAllIDsWithArticles().pipe(
      map((words) => words.map((word: { id: string }) => +word.id)),
      switchMap((availableIDs) => {
        return this.getSpecificWordsData(
          this.selectRandomNumbers(availableIDs, numberOfWords),
          numberOfWords,
        );
      }),
      take(1),
    );
  }

  private selectRandomNumbers(
    numbers: number[],
    numberOfSelections: number,
    exclude: number[] = [],
  ): number[] {
    const availableNumbers = numbers.filter((num) => !exclude.includes(num));

    const pool = [...availableNumbers];
    const selected: number[] = [];

    for (let i = 0; i < numberOfSelections; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      selected.push(pool[randomIndex]);
      pool.splice(randomIndex, 1);
    }

    return selected;
  }

  private fetchAllIDsWithArticles(): Observable<any> {
    const query = `
      SELECT A
      WHERE D IS NOT NULL
    `;
    return this.makeRequest(query);
  }

  private fetchRandomOnce(maxRows: number) {
    const offset = Math.floor(Math.random() * maxRows);

    const query = `
      SELECT A, B, C, D, E
      WHERE D IS NOT NULL
      LIMIT 1
      OFFSET ${offset}
    `;

    return this.makeRequest(query);
  }

  fetchMatchingWords(subString: string): Observable<WordCardModel[]> {
    const safeSubstring = subString.replace(/'/g, "\\'");
    const query = `
      SELECT A, B, C, D, E
      WHERE lower(B) CONTAINS lower('${safeSubstring}')
    `;

    return this.makeRequest(query);
  }

  private makeRequest(query: string) {
    const url =
      'https://docs.google.com/spreadsheets/d/1yRrrjbgYoQRKOnXMzhAFIZUgCnulSp8XYKZg3EuG4q0/gviz/tq?' +
      'tq=' +
      encodeURIComponent(query);

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((text) => {
        const json = JSON.parse(text.substring(47, text.length - 2));
        const cols = json.table.cols.map((c: any) => c.label);

        return json.table.rows.map((r: any) => {
          const obj: any = {};
          r.c.forEach((cell: any, i: number) => {
            obj[cols[i]] = cell?.v ?? null;
          });
          return obj;
        });
      }),
    );
  }

  private getRandomNumbersInRange(
    min: number = 0,
    max: number,
    count: number = 5,
    numbersToExclude: number[],
  ) {
    let unique = new Set();
    while (unique.size < count) {
      let n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (numbersToExclude.includes(n)) {
        continue;
      }
      unique.add(n);
    }
    return Array.from(unique) as number[];
  }

  private getSpecificWordsData(positions: number[], count: number) {
    let query = `
    SELECT A, B, C, D, E
    WHERE A = ${positions[0]}
  `;
    for (let i = 1; i < count; i++) {
      query += `OR A = ${positions[i]}`;
    }

    return this.makeRequest(query);
  }
}
