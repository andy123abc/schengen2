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
  startDateString: string = '';
  endDateString: string = '';

  //methods
  canAddTrip(startDateString: string, endDateString: string): boolean {
    this.errorMessage = ''; //reset error message

    //Check if there are values in start and end date
    if (startDateString == '' || endDateString == '') return false;

    //Check if arrival is after departure (can't happen unless time machine)
    if (startDateString > endDateString) {
      this.errorMessage = 'Departure date cannot be before arrival date';
      return false;
    }

    //Check if current dates intersect with another trip
    let startDate: Date = new Date(startDateString);
    let endDate: Date = new Date(endDateString);
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

  addTrip(trip: ITrip, startDateString: string, endDateString: string): void {
    //converting the date in a string format to a Date format
    trip.startDate = new Date(startDateString);
    trip.endDate = new Date(endDateString);

    //Sending the date to the parent
    this.tripAdded.emit(trip);

    //Reseting the date
    this.startDateString = '';
    this.endDateString = '';
    this.trip = {
      name: '',
      startDate: new Date(0),
      endDate: new Date(0),
      days: 0,
    };
  }
}
