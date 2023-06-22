import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITrip } from '../shared/trip';

@Component({
  selector: 'sh-addTrip',
  templateUrl: './trip-add.component.html',
})
export class TripAddComponent {
  trip: ITrip = {
    name: '',
    startDate: new Date(0),
    endDate: new Date(0),
    days: 0,
  };
  @Output() tripAdded: EventEmitter<ITrip> = new EventEmitter<ITrip>();
  @Input() trips: ITrip[] = []; //Input the trips just to make sure there are no intersections

  errorMessage: string = '';
  dateRange: Date[] = [];

  //methods
  canAddTrip(dates: Date[]): boolean {
    this.errorMessage = ''; //reset error message

    //Check if there are values in start and end date
    if (dates[0] == undefined || dates[1] == undefined) return false;

    const startDate: Date = dates[0];
    const endDate: Date = dates[1];
    //Check if arrival is after departure (can't happen unless time machine)
    if (startDate > endDate) {
      this.errorMessage = 'Departure date cannot be before arrival date';
      return false;
    }

    //Check if current dates intersect with another trip
    if (
      this.trips.filter(
        (trip: ITrip) =>
          (startDate <= trip.startDate && trip.startDate <= endDate) ||
          (startDate <= trip.endDate && trip.endDate <= endDate) ||
          (trip.startDate < startDate && endDate < trip.endDate)
      ).length > 0
    ) {
      this.errorMessage = 'Trip cannot intersect another trip';
      return false;
    }
    return true; //no issues can add trip
  }

  addTrip(trip: ITrip, dates: Date[]): void {
    //converting the date in a string format to a Date format
    trip.startDate = dates[0];
    trip.endDate = dates[1];

    //Sending the date to the parent
    this.tripAdded.emit(trip);

    //Reseting the date
    this.dateRange = [];
    this.trip = {
      name: '',
      startDate: new Date(0),
      endDate: new Date(0),
      days: 0,
    };
  }
}
