import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingsComponent } from './components/listings/listings.component';
import { CommonModule } from '@angular/common';
import { CarparkCitiesDataResolverService } from './services/resolvers/carpark-cities-data/carpark-cities-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'listings',
    pathMatch: 'full',
  },
  {
    path: 'listings',
    component: ListingsComponent,
    resolve: { carparkCityData: CarparkCitiesDataResolverService },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
