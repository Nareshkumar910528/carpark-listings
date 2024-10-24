import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, retry, takeUntil } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, timer } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
})
export class ListingsComponent implements OnInit, AfterViewInit {
  carparkDetails = [];
  columnsToBeDisplayed: string[] = [
    'carpark_number',
    'location',
    'lots_available',
    'total_lots',
  ];
  dataSource = new MatTableDataSource(this.carparkDetails);
  dataSourceWithObjectColumn = new MatSort();
  carparkNumberFilter = new FormControl('');
  carparkLocation = new FormControl('');
  selectedValue: string = '';
  filterValues = {
    carpark_number: '',
    location: '',
  };
  pageEvent!: PageEvent;
  pageSize = 5;
  pageIndex = 0;
  locationFilterValue!: string;

  private unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild('carparkPaginator') carparkPaginator!: MatPaginator;
  @ViewChild('carparkDataToBeSort') carparkDataToBeSort = new MatSort();

  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.retrieveCarparkData();
    this.getPaginatorDetailsUponPageReload();
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.carparkDetails);
    this.dataSource.paginator = this.carparkPaginator;
    this.dataSource.sort = this.carparkDataToBeSort;
    this.dataSource.filterPredicate = this.createFilter();
    this.carparkNumberFilter.valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(250))
      .subscribe((carpark_number) => {
        if (!carpark_number) return;
        this.filterValues.carpark_number = carpark_number;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      });
    this.carparkLocation.valueChanges
      .pipe(takeUntil(this.unsubscribe$), debounceTime(250))
      .subscribe((location) => {
        if (!location) return;
        this.filterValues.location = location;
        this.dataSource.filter = JSON.stringify(this.filterValues);
      }
    );
  }

  retrieveCarparkData() {
    this._activatedRoute.data
      .pipe(
        retry(3),
        takeUntil(this.unsubscribe$),
        catchError(() => of('Error occurred!'))
      )
      .subscribe(
        (records: any) => {
          const fullData = records.carparkCityData[0].items[0].carpark_data;
          fullData.splice(30, fullData.length);
          const data = fullData.filter(
            (data: { carpark_info: string | any[] }) => {
              return data.carpark_info.length === 1;
            }
          );

          const carparkInfo = {
            infoArray: data.map((info: any) => {
              info.carpark_info[0].lots_available = parseInt(
                info.carpark_info[0].lots_available
              );
              info.carpark_info[0].total_lots = parseInt(
                info.carpark_info[0].total_lots
              );
              return info.carpark_info[0];
            }),
          };

          for (let index = 0; index < carparkInfo.infoArray.length; index++) {
            carparkInfo.infoArray[index].carpark_number =
              data[index].carpark_number;
            carparkInfo.infoArray[index].location =
              records.carparkCityData[1].data[index];
          }
          this.carparkDetails = carparkInfo.infoArray;
          console.log(this.carparkDetails);
        },
        (error) => {
          console.error('Retried 3 times, but still failed.');
          window.alert(error);
        }
      );
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: any, filter: any): boolean {
      let searchTerms = JSON.parse(filter);
      return (
        data.carpark_number
          .toLowerCase()
          .indexOf(searchTerms.carpark_number) !== -1 &&
        data.location.toString().toLowerCase().indexOf(searchTerms.location) !==
          -1
      );
    };
    return filterFunction;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    const paginatorDetails = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }

    sessionStorage.setItem('paginatorDetails', JSON.stringify(paginatorDetails));
  }

  getPaginatorDetailsUponPageReload() {
    const paginatorDetails = sessionStorage.getItem('paginatorDetails');

    if(!paginatorDetails) return;
    const paginatorObj = JSON.parse(paginatorDetails);
    
    this.pageSize = paginatorObj.pageSize;
    this.pageIndex = paginatorObj.pageIndex;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify(filterValue.trim().toLowerCase());

    if (filterValue.length === 0) {
      this.dataSource.filter = ''
    }
  }

  filterSelectedValue() {
    switch (this.selectedValue) {
      case 'All':
         this.dataSource.filter = ''
         break;
      default:
        this.filterValues.location = this.selectedValue.trim().toLowerCase();
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
