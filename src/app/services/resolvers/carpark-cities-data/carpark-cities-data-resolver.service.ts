import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CarparkDataService } from '../../carpark-data/carpark-data.service';
import { CityNamesService } from '../../city-names/city-names.service';

@Injectable({
  providedIn: 'root',
})
export class CarparkCitiesDataResolverService implements Resolve<any> {
  private _carparkDataService = inject(CarparkDataService);
  private _cityNamesService = inject(CityNamesService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    console.log(
      'calling getCarparkData() & getCityNames() by using forkJoin operator in resolver --> ',
      route
    );
    return forkJoin([
      this._carparkDataService.getCarparkData(),
      this._cityNamesService.getCityNames().pipe(
        catchError((error) => {
          console.log('resolve method return error as follow --> ', error);
          return of('No data available at the moment');
        })
      ),
    ]);
  }
}
