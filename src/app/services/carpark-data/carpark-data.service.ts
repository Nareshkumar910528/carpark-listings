import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarparkDataService {
  carparkBaseAPIURL: string = 'https://api.data.gov.sg/v1/';

  private http = inject(HttpClient);

  getCarparkData(): Observable<any> {
    let apiURL = this.carparkBaseAPIURL + '/transport/carpark-availability';
    return this.http.get(apiURL);
  }
}
