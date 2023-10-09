import { DateTime } from 'luxon';
import { TripAddComponent } from './trip-add.component';
import { ITrip } from '../shared/trip';
import { FormControl, FormGroup } from '@angular/forms';

describe('trip-add (isolated)', () => {
  let component: TripAddComponent;
  let trips: ITrip[];
  let dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  let trip: ITrip;

  beforeEach(() => {
    trips = [
      {
        name: 'trip1',
        startDate: DateTime.utc(2023, 6, 15),
        endDate: DateTime.utc(2023, 6, 20),
        days: 0,
      },
      {
        name: 'trip2',
        startDate: DateTime.utc(2023, 7, 15),
        endDate: DateTime.utc(2023, 7, 20),
        days: 0,
      },
    ];

    trip = {
        name: '',
        startDate: DateTime.utc(0),
        endDate: DateTime.utc(0),
        days: 0,
    }

    component = new TripAddComponent();
    component.trips = trips;
    component.trip = trip;
    component.errorMessage = 'Error Message'; //putting in a error message
  });

  it('Should be true', () => {
    //Arrange
    //Act
    //Assert
    expect(true).toBe(true);
  });

  describe('canAddTrip', () => {
    it('Should return true for dates well within two trips', () => {
      //Arrange
      dateRange.controls.start.setValue(new Date(2023, 6, 25));
      dateRange.controls.end.setValue(new Date(2023, 7, 5));
      component.dateRange = dateRange;
      //Act
      let result: boolean = component.canAddTrip();
      //Assert
      expect(result).toBe(true);
      expect(component.errorMessage).toBe('');
    });

    it('Should return true for dates within two trips (no gaps)', () => {
      //Arrange
      dateRange.controls.start.setValue(new Date(2023, 6 - 1, 21));
      dateRange.controls.end.setValue(new Date(2023, 7 - 1, 14));
      component.dateRange = dateRange;
      //Act
      let result: boolean = component.canAddTrip();
      //Assert
      expect(result).toBe(true);
      expect(component.errorMessage).toBe('');
    });

    it('Should return false for nothing changed to date range (null values)', () => {
      //Arrange
      //Default is null for date range
      //Act
      let result: boolean = component.canAddTrip();
      //Assert
      expect(result).toBe(false);
      expect(component.errorMessage).toBe('');
    });

    it('Should return false for dates that overlap second trip', () => {
      //Arrange
      dateRange.controls.start.setValue(new Date(2023, 6 - 1, 21));
      dateRange.controls.end.setValue(new Date(2023, 7 - 1, 15));
      component.dateRange = dateRange;
      //Act
      let result: boolean = component.canAddTrip();
      //Assert
      expect(result).toBe(false);
      expect(component.errorMessage).toContain('cannot intersect');
    });

    it('Should return false for dates that overlap first trip', () => {
        //Arrange
        dateRange.controls.start.setValue(new Date(2023, 6 - 1, 20));
        dateRange.controls.end.setValue(new Date(2023, 7 - 1, 14));
        component.dateRange = dateRange;
        //Act
        let result: boolean = component.canAddTrip();
        //Assert
        expect(result).toBe(false);
        expect(component.errorMessage).toContain('cannot intersect');
      });

      it('Should return false for dates that surround a trip', () => {
        //Arrange
        dateRange.controls.start.setValue(new Date(2023, 5 - 1, 20));
        dateRange.controls.end.setValue(new Date(2023, 7 - 1, 14));
        component.dateRange = dateRange;
        //Act
        let result: boolean = component.canAddTrip();
        //Assert
        expect(result).toBe(false);
        expect(component.errorMessage).toContain('cannot intersect');
      });

      it('Should return false for dates within a trip', () => {
        //Arrange
        dateRange.controls.start.setValue(new Date(2023, 6 - 1, 16));
        dateRange.controls.end.setValue(new Date(2023, 6 - 1, 18));
        component.dateRange = dateRange;
        //Act
        let result: boolean = component.canAddTrip();
        //Assert
        expect(result).toBe(false);
        expect(component.errorMessage).toContain('cannot intersect');
      });

      it('Should return false if start date is greater than the end date', () => {
        //Arrange
        dateRange.controls.start.setValue(new Date(2023, 7 - 1, 6));
        dateRange.controls.end.setValue(new Date(2023, 7 - 1, 4));
        component.dateRange = dateRange;
        //Act
        let result: boolean = component.canAddTrip();
        //console.log(component.dateRange);
        //Assert
        expect(result).toBe(false);
        expect(component.errorMessage).toContain('Departure date cannot');
      });
  });

  describe('convertToDateTime', () => {
    it('Should convert Date to DateTime with null input', () => {
      //Arrange
      //Act
      let result: DateTime = component.convertToDateTime(null);
      //Assert
      expect(result).toEqual(DateTime.utc(0));
    });

    it('Should convert Date to DateTime with standard input', () => {
      //Arrange
      let date: Date = new Date(2023, 4, 15); //Javascript has months from 0-11
      //Act
      let result: DateTime = component.convertToDateTime(date);
      //Assert
      expect(result).toEqual(DateTime.utc(2023, 5, 15));
    });

    it('Should convert Date to DateTime with extreme high input', () => {
      //Arrange
      let date: Date = new Date(9999, 11, 15); //Javascript has months from 0-11
      //Act
      let result: DateTime = component.convertToDateTime(date);
      //Assert
      expect(result).toEqual(DateTime.utc(9999, 12, 15));
    });
  });

  describe('addTrip', () => {
    it('Should add trip check reset values', () => {
        //Arrange
        dateRange.controls.start.setValue(new Date(2023, 6 - 1, 21));
        dateRange.controls.end.setValue(new Date(2023, 7 - 1, 14));
        component.dateRange = dateRange;
        component.trip.name = 'New Trip';
        //Act
        component.addTrip();
        //Assert
        expect(component.trip.name).toBe('');
        expect(component.dateRange.controls.start.value).toBe(null);
        expect(component.dateRange.controls.end.value).toBe(null);
      });
      it('Should add trip check ouput trip', () => {
        //Arrange
        dateRange.controls.start.setValue(new Date(2023, 6 - 1, 21));
        dateRange.controls.end.setValue(new Date(2023, 7 - 1, 14));
        component.dateRange = dateRange;
        component.trip.name = 'New Trip';
        
        //Act
        component.addTrip();
        //Assert
        expect(component.trip.name).toBe('');
        //TODO: Check the emit
      });
  });
});
