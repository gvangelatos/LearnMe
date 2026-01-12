import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  defaultIfEmpty,
  defer,
  filter,
  map,
  repeat,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GsApiService {
  private readonly http = inject(HttpClient);
  private readonly MAX_RETRIES = 5;
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

  getRandomWords(existingIds?: number[]) {
    return this.getMaxId().pipe(
      switchMap((maxId) => {
        return this.getSpecificWordsData(
          this.getRandomNumbersInRange(0, maxId, 6, existingIds ?? []),
        );
      }),
    );
  }

  getRandomWordWithArticle() {
    return this.getMaxId().pipe(
      switchMap((maxId) => {
        return defer(() => this.fetchRandomOnce(maxId)).pipe(
          repeat({ count: this.MAX_RETRIES }),
          filter((value) => value !== null),
          take(1),
          defaultIfEmpty(null),
        );
      }),
    );
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

  getSpecificWordsData(positions: number[]) {
    const query = `
    SELECT A, B, C, D, E
    WHERE A = ${positions[0]} OR A = ${positions[1]} OR A = ${positions[2]} OR A = ${positions[3]} OR A = ${positions[4]} OR A = ${positions[5]}
  `;

    return this.makeRequest(query);
  }
}
