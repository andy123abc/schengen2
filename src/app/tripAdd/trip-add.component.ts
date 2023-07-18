import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITrip } from '../shared/trip';
import { DateTime } from 'luxon';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sh-addTrip',
templateUrl: './trip-add.component.html',
})
export class TripAddComponent {
  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  trip: ITrip = {
    name: '',
    startDate: DateTime.utc(0),
    endDate: DateTime.utc(0),
    days: 0,
  };
  @Output() tripAdded: EventEmitter<ITrip> = new EventEmitter<ITrip>();
  @Input() trips: ITrip[] = []; //Input the trips just to make sure there are no intersections

  errorMessage: string = '';

  //methods
  canAddTrip(): boolean {
    this.errorMessage = ''; //reset error message

    //Check if there are values in start and end date
    if (!this.dateRange.controls.start.valid || this.dateRange.controls.start.value === null ||
      !this.dateRange.controls.end.valid || this.dateRange.controls.end.value === null) return false;

    const startDate: DateTime = this.convertToDateTime(this.dateRange.controls.start.value);
    const endDate: DateTime = this.convertToDateTime(this.dateRange.controls.end.value);
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
    return true; //no issues, can add trip
  }

  //helper class
  convertToDateTime(date: Date|null): DateTime {
    if (date == null) return DateTime.utc(0);
    return DateTime.utc(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  addTrip(): void {
    //converting the date in a string format to a Date format
    this.trip.startDate = this.convertToDateTime(this.dateRange.controls.start.value);
    this.trip.endDate = this.convertToDateTime(this.dateRange.controls.end.value);

    //Sending the date to the parent
    this.tripAdded.emit(this.trip);

    //Reseting the values after the trip has been added
    this.dateRange.reset();
    this.trip = {
      name: '',
      startDate: DateTime.utc(0),
      endDate: DateTime.utc(0),
      days: 0,
    };
  }
}
