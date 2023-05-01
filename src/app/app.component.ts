import { Component, OnInit } from '@angular/core';
import { TripService } from './core/trip.service';
import { IDate } from './shared/date';
import { ITrip } from './shared/trip';

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
    let current: Date = new Date(0); //The current date that is being processed
    let final: Date = new Date(); //The last date for the date list (final date + FutureEndDate)

    if (this.trips.length == 0) return; //Don't calculate if no trips

    //Sort the trips to make sure they are in order
    this.trips = this.trips.sort((a, b) =>
      a.startDate < b.startDate ? -1 : 1
    );

    //Create record to add to date list
    function createDate(
      current: Date,
      tripName: string,
      isInSchengen: boolean,
      dates: IDate[]
    ): IDate {
      tripName = isInSchengen ? tripName : '(Not Schengen)';
      tripName = tripName!=='' ? tripName : '(Not Named)';//For those trips that don't have a trip name, put in a default
      let balance: number = 1; //The balance of the available days, default to 1

      //Get balance from previous record and if new date is schengen then add 1
      if (dates.length > 0)
        balance = dates[dates.length - 1].balance + (isInSchengen ? 1 : 0);

      //Go back 180 days and check if a day should be removed from the balance
      if (dates.length >= 180)
        balance -= dates[dates.length - 180].isInSchengen ? 1 : 0;

      const date180Future: Date = new Date(current.valueOf());
      date180Future.setUTCDate(date180Future.getUTCDate() + 180);

      const date180Past: Date = new Date(current.valueOf());
      date180Past.setUTCDate(date180Past.getUTCDate() - 180);

      return {
        date: new Date(current),
        tripName: tripName,
        isInSchengen: isInSchengen,
        balance: balance,
        date180Future: date180Future,
        date180Past: date180Past,
      };
    }

    //Add Date
    function addDays(date: Date, days: number): void {
      date.setUTCDate(date.getUTCDate() + days);
    }

    //Go through each Schengen trip
    for (let trip of this.trips) {
      //Calculate the number of days in each trip
      const start: Date = new Date(trip.startDate); //Doing a New Date to make a deep copy
      const end: Date = new Date(trip.endDate); //Doing a New Date to make a deep copy

      //Set the number of days of the trip
      trip.days = (end.valueOf() - start.valueOf()) / MillisecondsPerDay + 1;

      //Check if at beginning
      if (current.valueOf() == new Date(0).valueOf()) {
        current = start;
      } else {
        //Since there is no overlap (by definition), need to fill in the gap
        while (current < start) {
          this.dates.push(createDate(current, '', false, this.dates));
          addDays(current, 1);
        }
      }
      final = new Date(end.setUTCDate(end.getUTCDate() + FutureEndDate));

      //Add days of trip that are in Schengen
      for (let i = 0; i < trip.days; i++) {
        this.dates.push(createDate(current, trip.name, true, this.dates));
        addDays(current, 1);
      }
    }

    //Go 180 days past the end to get the availalbe days to zero
    while (current < final) {
      this.dates.push(createDate(current, '', false, this.dates));
      addDays(current, 1);
    }
  }

  //Initialize and Config
  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    //Basic Test One trip
    //this.addTrip({ name: 'test', startDate: '2023-01-01', endDate: '2023-01-10' });
    this.trips = this.tripService.getTrips();
    this.calculate();
  }
}
