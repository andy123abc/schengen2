import { Injectable } from "@angular/core";
import { ITrip } from "../shared/trip";

@Injectable({
    providedIn: 'root'
})
export class TripService {
    getTrips(): ITrip[] {
        return [
            //Basic Test One trip
            //{ name: 'test', startDate: '2023-01-01', endDate: '2023-01-10' ,days:0 },
            //Two trips
            // { name: 'Milan', startDate: '2023-01-01', endDate: '2023-01-10',days:0  },
            // { name: 'Barcelona', startDate: '2023-02-01', endDate: '2023-02-10',days:0  },
            //Test One long trip
            // { name:'Long trip', startDate:'2023-01-01', endDate:'2023-04-01',days:0 },
            //Complex coming and going (the final test)
            { name: 'Spain', startDate: new Date('2022-11-08'), endDate: new Date('2022-12-01'), days: 0 },
            { name: 'Portugal', startDate: new Date('2023-01-31'), endDate: new Date('2023-03-30'), days: 0 },
            { name: 'Italy', startDate: new Date('2023-06-12'), endDate: new Date('2023-06-20'), days: 0 },
            { name: 'Eastern Europe', startDate: new Date('2023-07-16'), endDate: new Date('2023-09-30'), days: 0 },
            { name: 'Iceland', startDate: new Date('2023-12-09'), endDate: new Date('2023-12-21'), days: 0 },
        ]
    }
}