import { Component, OnInit } from '@angular/core';
import { TripService } from './core/trip.service';
import { IDate } from './shared/date';
import { ITrip } from './shared/trip';
import { DateTime } from 'luxon';
import { IInput } from './shared/input';

@Component({
  selector: 'sh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  trips: ITrip[] = [];
  dates: IDate[] = [];

  //Initialize and Config
  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    // Prepopulate with sample trips, good for testing

    this.tripService.getTrips().subscribe({
      next: (inputs) => {
        this.trips = this.convertInputToTrips(inputs, 4);
        this.calculate();
      },
      error: (err) => console.log(err),
    });
  }

  //methods
  convertInputToTrips(inputs: IInput[], example: number): ITrip[] {
    let trips: ITrip[] = [];
    for (let input of inputs.filter((f) => f.example == example)) {
      let trip: ITrip = {
        name: input.name,
        startDate: DateTime.fromFormat(input.startDate, 'yyyy-MM-dd', {
          zone: 'utc',
        }),
        endDate: DateTime.fromFormat(input.endDate, 'yyyy-MM-dd', {
          zone: 'utc',
        }),
        days: 0,
      };
      trips.push(trip);
    }
    return trips;
  }

  addTrip(newTrip: ITrip) {
    this.trips.push(newTrip);
    this.calculate();
  }

  removeTrip(removeTrip: ITrip) {
    this.trips = this.trips.filter(
      (trip: ITrip) =>
        trip.startDate.toMillis() != removeTrip.startDate.toMillis()
    );
    this.calculate();
  }

  //Create record to add to date list
  createDate(
    current: DateTime,
    tripName: string,
    isInSchengen: boolean,
    dates: IDate[]
  ): IDate {
    tripName = isInSchengen ? tripName : '(Not Schengen)';
    tripName = tripName.length > 0 ? tripName : '(Schengen)'; //For those trips that don't have a trip name, put in a default
    let balance: number = isInSchengen ? 1 : 0; //The balance of the available days

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

  //TODO: Add buttons with routing to show different scenarios
  //TODO:Add a check to make sure the trips are valid, no intersections, no departure before arrival, dates are in proper range

  //This is run every time there is a change to the list
  //Assumption: The trips don't have any date issues (no intersections, no bad dates, no depature before arrival)
  calculate(): void {
    const FutureEndDate = 181; //How many days to go into the future
    this.dates = []; //reset the dates as going to calculate them
    let current: DateTime = DateTime.utc(0); //The current date that is being processed
    let final: DateTime = DateTime.utc(0); //The last date for the date list (final date + FutureEndDate)

    if (this.trips.length == 0) return; //Don't calculate if no trips

    //Sort the trips to make sure they are in order
    this.trips = this.trips.sort((a, b) =>
      a.startDate < b.startDate ? -1 : 1
    );

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
          this.dates.push(this.createDate(current, '', false, this.dates));
          current = current.plus({ days: 1 });
        }
      }
      final = end.plus({ days: FutureEndDate }); //Determining the final end date

      //Add days of trip that are in Schengen
      for (let i = 0; i < trip.days; i++) {
        this.dates.push(this.createDate(current, trip.name, true, this.dates));
        current = current.plus({ days: 1 });
      }
    }

    //Go 180 days past the end to get the available days to zero
    while (current < final) {
      this.dates.push(this.createDate(current, '', false, this.dates));
      current = current.plus({ days: 1 });
    }
  }
}
