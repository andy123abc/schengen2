import { Component, OnInit } from '@angular/core';
import { TripService } from './core/trip.service';
import { IDate } from './shared/date';
import { ITrip } from './shared/trip';
import { DateTime } from 'luxon';

@Component({
  selector: 'sh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  trips: ITrip[] = [];
  dates: IDate[] = [];

  //methods
  addTrip(newTrip: ITrip) {
    this.trips.push(newTrip);
    this.calculate();
  }

  removeTrip(removeTrip: ITrip) {
    if (removeTrip == undefined) this.trips = [];
    else
      this.trips = this.trips.filter(
        (trip: ITrip) => trip.startDate != removeTrip.startDate
      );
    this.calculate();
  }

  //This is run every time there is a change to the list
  //Assumption: The trips don't have any date issues (no intersections, no bad dates, no depature before arrival)
  calculate(): void {
    const MillisecondsPerDay: number = 1000 * 60 * 60 * 24;
    const FutureEndDate = 181; //How many days to go into the future
    this.dates = []; //reset the dates as going to calculate them
    let current: DateTime = DateTime.utc(0); //The current date that is being processed
    let final: DateTime = DateTime.utc(0); //The last date for the date list (final date + FutureEndDate)

    if (this.trips.length == 0) return; //Don't calculate if no trips

    //Sort the trips to make sure they are in order
    this.trips = this.trips.sort((a, b) =>
      a.startDate < b.startDate ? -1 : 1
    );

    //Create record to add to date list
    function createDate(
      current: DateTime,
      tripName: string,
      isInSchengen: boolean,
      dates: IDate[]
    ): IDate {
      tripName = isInSchengen ? tripName : '(Not Schengen)';
      tripName = tripName !== '' ? tripName : '(Schengen)'; //For those trips that don't have a trip name, put in a default
      let balance: number = 1; //The balance of the available days, default to 1

      //Get balance from previous record and if new date is schengen then add 1
      if (dates.length > 0)
        balance = dates[dates.length - 1].balance + (isInSchengen ? 1 : 0);

      //Go back 180 days and check if a day should be removed from the balance
      if (dates.length >= 180)
        balance -= dates[dates.length - 180].isInSchengen ? 1 : 0;

      const date180Future: DateTime = current.plus({ days: 180 });
      const date180Past: DateTime = current.minus({ days: 180 });

      return {
        date: current,
        tripName: tripName,
        isInSchengen: isInSchengen,
        balance: balance,
        date180Future: date180Future,
        date180Past: date180Past,
      };
    }

    //Go through each Schengen trip
    for (let trip of this.trips) {
      //Calculate the number of days in each trip
      const start: DateTime = trip.startDate; //luxon does a deep copy
      const end: DateTime = trip.endDate; //luxon does a deep copy

      //Set the number of days of the trip
      trip.days = end.diff(start, 'days').as('days') + 1;

      //Check if at beginning
      if (current.toMillis() == DateTime.utc(0).toMillis()) {
        current = start;
      } else {
        //Since there is no overlap (by definition), need to fill in the gap
        while (current < start) {
          this.dates.push(createDate(current, '', false, this.dates));
          current = current.plus({ days: 1 });
        }
      }
      final = end.plus({ days: FutureEndDate }); //Determining the final end date

      //Add days of trip that are in Schengen
      for (let i = 0; i < trip.days; i++) {
        this.dates.push(createDate(current, trip.name, true, this.dates));
        current = current.plus({ days: 1 });
      }
    }

    //Go 180 days past the end to get the available days to zero
    while (current < final) {
      this.dates.push(createDate(current, '', false, this.dates));
      current = current.plus({ days: 1 });
    }
  }

  //Initialize and Config
  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.trips = this.tripService.getTrips(); //Prepopulate with sample trips, good for testing
    this.calculate();
  }
}
