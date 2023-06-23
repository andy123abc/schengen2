import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BalanceComponent } from './balance/balance.component';
import { TripAddComponent } from './tripAdd/trip-add.component';
import { TripsComponent } from './trips/trips.component';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TripAddComponent,
    TripsComponent,
    BalanceComponent,
  ],
  imports: [BrowserModule, FormsModule, FontAwesomeModule, BsDatepickerModule.forRoot(), BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTrash);
  }
}
