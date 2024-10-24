import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CityNamesService {
  cityNameBaseAPIURL: string =
    'https://countriesnow.space/api/v0.1/countries/cities/q?';

  private http = inject(HttpClient);

  getCityNames(): Observable<any> {
    let apiURL = this.cityNameBaseAPIURL + 'country=Singapore';
    return this.http.get(apiURL);
  }
}
