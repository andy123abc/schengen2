import { DateTime } from 'luxon';
import { AppComponent } from './app.component';
import { ITrip } from './shared/trip';
import { TripService } from './core/trip.service';
import { IInput } from './shared/input';
import { IDate } from './shared/date';
import { compileNgModule } from '@angular/compiler';

describe('app (isolated)', () => {
  let component: AppComponent;
  let trips: ITrip[];
  let mockTripService: TripService;

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

    mockTripService = jasmine.createSpyObj(['getTrips']);

    component = new AppComponent(mockTripService);
    component.trips = trips;
  });

  describe('Initial Setup', () => {
    it('Should be true', () => {
      //Arrange
      //Act
      //Assert
      expect(true).toBe(true);
      expect(component.trips.length).toBe(2);
    });
  });

  describe('convertInputToTrips', () => {
    it('Should convert inputs to two trips', () => {
      //Arrange
      let inputs: IInput[] = [
        {
          example: 1,
          name: 'input1',
          startDate: '2023-09-01',
          endDate: '2023-09-15',
        },
        {
          example: 1,
          name: 'input2',
          startDate: '2023-10-01',
          endDate: '2023-10-15',
        },
      ];
      //Act
      let result = component.convertInputToTrips(inputs, 1);
      //Assert
      expect(result.length).toBe(2);
    });
    it('Should not convert any trips and return empty array', () => {
      //Arrange
      let inputs: IInput[] = [
        {
          example: 1,
          name: 'input1',
          startDate: '2023-09-01',
          endDate: '2023-09-15',
        },
        {
          example: 1,
          name: 'input2',
          startDate: '2023-10-01',
          endDate: '2023-10-15',
        },
      ];
      //Act
      let result = component.convertInputToTrips(inputs, 2);
      //Assert
      expect(result.length).toBe(0);
    });
  });

  describe('addTrip', () => {
    it('Should add one trip', () => {
      //Arrange
      let trip: ITrip = {
        name: 'trip3',
        startDate: DateTime.utc(2023, 9, 15),
        endDate: DateTime.utc(2023, 9, 20),
        days: 0,
      };
      //Act
      component.addTrip(trip);
      //Assert
      expect(component.trips.length).toBe(3);
      expect(component.trips[2].name).toContain('trip3');
    });
  });

  describe('removeTrip', () => {
    it('Should remove one trip', () => {
      //Arrange
      let trip: ITrip = {
        name: 'trip1',
        startDate: DateTime.utc(2023, 6, 15),
        endDate: DateTime.utc(2023, 6, 20),
        days: 0,
      };
      //Act
      component.removeTrip(trip);
      //Assert
      expect(component.trips.length).toBe(1);
      expect(component.trips[0].name).toContain('trip2');
    });

    it('Should not remove a  trip', () => {
      //Arrange
      let trip: ITrip = {
        name: 'trip1',
        startDate: DateTime.utc(0),
        endDate: DateTime.utc(0),
        days: 0,
      };
      //Act
      component.removeTrip(trip);
      //Assert
      expect(component.trips.length).toBe(2);
    });
  });

  describe('createDate', () => {
    let current: DateTime;
    let tripName: string;
    let isInSchengen: boolean;
    let dates: IDate[];

    beforeEach(() => {
      current = DateTime.utc(2023, 2, 1);
      tripName = 'trip';
      isInSchengen = false;
      dates = [];
    });

    it('Should return valid IDate with no existing dates and not in Schengen', () => {
      //Arrange
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.date.toMillis()).toBe(current.toMillis());
      expect(result.tripName).toBe('(Not Schengen)');
      expect(result.isInSchengen).toBe(isInSchengen);
      expect(result.balance).toBe(0);
      expect(result.date180Future.toMillis()).toBe(
        DateTime.utc(2023, 7, 31).toMillis()
      );
      expect(result.date180Past.toMillis()).toBe(
        DateTime.utc(2022, 8, 5).toMillis()
      );
    });

    it('Should return valid trip name when in Schengen', () => {
      //Arrange
      isInSchengen = true;
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.tripName).toBe('trip');
    });

    it('Should return valid trip name when in Schengen and no trip name', () => {
      //Arrange
      isInSchengen = true;
      tripName = '';
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.tripName).toBe('(Schengen)');
    });

    it('Should return balance of 11 when previous balance is 10 and in Schegen', () => {
      //Arrange
      isInSchengen = true;
      dates.push({
        date: DateTime.utc(2023, 1, 31),
        tripName: 'name',
        isInSchengen: true,
        balance: 10,
        date180Future: DateTime.utc(2023, 7, 30),
        date180Past: DateTime.utc(2022, 8, 4),
      });
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.balance).toBe(11);
    });

    it('Should return balance of 10 when previous balance is 10 and not in Schegen', () => {
      //Arrange
      isInSchengen = false;
      dates.push({
        date: DateTime.utc(2023, 1, 31),
        tripName: 'name',
        isInSchengen: true,
        balance: 10,
        date180Future: DateTime.utc(2023, 7, 30),
        date180Past: DateTime.utc(2022, 8, 4),
      });
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.balance).toBe(10);
    });

    it('Should return balance of 1 when previous balance is 1, in Schegen, and record from 180 days ago', () => {
      //Arrange
      isInSchengen = true;
      const startDate: DateTime = DateTime.utc(2022, 8, 4);
      for (let i = 0; i < 180; i++) {
        dates.push({
          date: startDate.plus({ days: i }),
          tripName: i === 0 ? '180 Prev' : 'temp',
          isInSchengen: i === 0 ? true : false,
          balance: 1,
          date180Future: startDate.plus({ days: i + 180 }),
          date180Past: startDate.plus({ days: i - 180 }),
        });
        //console.log(dates[i].isInSchengen,  dates[i].date.toLocaleString(),dates[i].date180Past.toLocaleString(),dates[i].date180Future.toLocaleString())
      }
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.balance).toBe(1);
    });

    it('Should return balance of 0 when previous balance is 1, not in Schegen, and record from 180 days ago', () => {
      //Arrange
      isInSchengen = false;
      const startDate: DateTime = DateTime.utc(2022, 8, 4);
      for (let i = 0; i < 180; i++) {
        dates.push({
          date: startDate.plus({ days: i }),
          tripName: i === 0 ? '180 Prev' : 'temp',
          isInSchengen: i === 0 ? true : false,
          balance: 1,
          date180Future: startDate.plus({ days: i + 180 }),
          date180Past: startDate.plus({ days: i - 180 }),
        });
        //console.log(dates[i].isInSchengen,  dates[i].date.toLocaleString(),dates[i].date180Past.toLocaleString(),dates[i].date180Future.toLocaleString())
      }
      //Act
      let result = component.createDate(current, tripName, isInSchengen, dates);
      //Assert
      expect(result.balance).toBe(0);
    });
  });

  describe('calculate', () => {
    it('Should sort trips correctly by adding a trip at the end that is a year earilier', () => {
      //Arrange
      component.trips.push({
        name: 'Early',
        startDate: DateTime.utc(2022, 7, 15),
        endDate: DateTime.utc(2022, 7, 20),
        days: 0,
      });
      expect(component.trips.length).toBe(3);
      expect(component.trips[2].name).toBe('Early');
      //Act
      component.calculate();
      //Assert
      expect(component.trips.length).toBe(3);
      expect(component.trips[0].name).toBe('Early');
    });

    it('Should calculate number of days on trip correctly for six day trip', () => {
      //Arrange
      //Act
      component.calculate();
      //Assert
      expect(component.trips[0].days).toBe(6);
    });

    it('Should calculate number of days on trip correctly for one day trip', () => {
        //Arrange
        component.trips.push({
            name: 'OneDayTrip',
            startDate: DateTime.utc(2023, 10, 15),
            endDate: DateTime.utc(2023, 10, 15),
            days: 0,
          });
        //Act
        component.calculate();
        //Assert
        expect(component.trips[2].days).toBe(1);
      });

      it('Should calculate records correctly for one trip with one day', () => {
        //Arrange
        component.trips = [{
            name: 'OneDayTrip',
            startDate: DateTime.utc(2023, 2, 1),
            endDate: DateTime.utc(2023, 2, 1),
            days: 0,
          }]
        //Act
        component.calculate();
        //Assert
        expect(component.dates.length).toBe(181);
  
        expect(component.dates[0].balance).toBe(1);
        expect(component.dates[0].tripName).toBe("OneDayTrip");
        expect(component.dates[0].date).toEqual(DateTime.utc(2023, 2, 1));
        expect(component.dates[0].date180Future).toEqual(DateTime.utc(2023, 7, 31));
        expect(component.dates[0].date180Past).toEqual(DateTime.utc(2022, 8, 5));
        expect(component.dates[0].isInSchengen).toBe(true);
  
        expect(component.dates[1].balance).toBe(1);
        expect(component.dates[1].tripName).toBe("(Not Schengen)");
        expect(component.dates[1].date).toEqual(DateTime.utc(2023, 2, 2));
        expect(component.dates[1].isInSchengen).toBe(false);
  
        expect(component.dates[100].balance).toBe(1);
        expect(component.dates[100].tripName).toBe("(Not Schengen)");
        expect(component.dates[100].date).toEqual(DateTime.utc(2023, 5, 12));
        expect(component.dates[100].isInSchengen).toBe(false);
  
        expect(component.dates[180].balance).toBe(0);
        expect(component.dates[180].tripName).toBe("(Not Schengen)");
        expect(component.dates[180].date).toEqual(DateTime.utc(2023, 7, 31));
        expect(component.dates[180].isInSchengen).toBe(false);
      });

    it('Should calculate records correctly for two trips each with 6 days', () => {
      //Arrange
      //Act
      component.calculate();
      //Assert
      expect(component.dates.length).toBe(216);

      expect(component.dates[0].balance).toBe(1);
      expect(component.dates[0].tripName).toBe("trip1");
      expect(component.dates[0].date).toEqual(DateTime.utc(2023, 6, 15));
      expect(component.dates[0].date180Future).toEqual(DateTime.utc(2023, 12, 12));
      expect(component.dates[0].date180Past).toEqual(DateTime.utc(2022, 12, 17));
      expect(component.dates[0].isInSchengen).toBe(true);

      expect(component.dates[5].balance).toBe(6);
      expect(component.dates[5].tripName).toBe("trip1");
      expect(component.dates[5].date).toEqual(DateTime.utc(2023, 6, 20));
      expect(component.dates[5].isInSchengen).toBe(true);

      expect(component.dates[6].balance).toBe(6);
      expect(component.dates[6].tripName).toBe("(Not Schengen)");
      expect(component.dates[6].date).toEqual(DateTime.utc(2023, 6, 21));
      expect(component.dates[6].isInSchengen).toBe(false);

      expect(component.dates[30].balance).toBe(7);
      expect(component.dates[30].tripName).toBe("trip2");
      expect(component.dates[30].date).toEqual(DateTime.utc(2023, 7, 15));
      expect(component.dates[30].isInSchengen).toBe(true);

      expect(component.dates[100].balance).toBe(12);
      expect(component.dates[100].tripName).toBe("(Not Schengen)");
      expect(component.dates[100].date).toEqual(DateTime.utc(2023, 9, 23));
      expect(component.dates[100].isInSchengen).toBe(false);

      expect(component.dates[215].balance).toBe(0);
      expect(component.dates[215].tripName).toBe("(Not Schengen)");
      expect(component.dates[215].date).toEqual(DateTime.utc(2024, 1, 16));
      expect(component.dates[215].isInSchengen).toBe(false);
    });
  });
});
