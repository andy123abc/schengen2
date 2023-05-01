import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BalanceComponent } from './balance/balance.component';
import { UtcDate } from './shared/utc-date.pipe';
import { TripAddComponent } from './tripAdd/trip-add.component';
import { TripsComponent } from './trips/trips.component';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    TripAddComponent,
    TripsComponent,
    BalanceComponent,
    UtcDate,
  ],
  imports: [BrowserModule, FormsModule, FontAwesomeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrash);
  }
}
