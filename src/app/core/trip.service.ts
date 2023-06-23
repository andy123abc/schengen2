import { Injectable } from "@angular/core";
import { ITrip } from "../shared/trip";
import { DateTime } from 'luxon';

@Injectable({
    providedIn: 'root'
})
export class TripService {
    getTrips(): ITrip[] {
        return [
            //Basic Test One trip
            // { name: 'One Trip Test', startDate: DateTime.utc(2023,1,1), endDate: DateTime.utc(2023,1,10),days:0 },
            //Two trips
            // { name: 'Milan trip 1', startDate: DateTime.utc(2023,1,1), endDate: DateTime.utc(2023,1,10),days:0  },
            // { name: 'Barcelona trip 2', startDate: DateTime.utc(2023,2,1), endDate: DateTime.utc(2023,2,10),days:0  },
            //Test One long trip
            //{ name:'Long trip', startDate:DateTime.utc(2023,1,1), endDate:DateTime.utc(2023,4,1),days:0 },
            //Complex coming and going (the final test)
            { name: 'Spain', startDate: DateTime.utc(2022,11,8), endDate: DateTime.utc(2022,12,1), days: 0 },
            { name: 'Portugal', startDate: DateTime.utc(2023,1,31), endDate: DateTime.utc(2023,3,30), days: 0 },
            { name: 'Italy', startDate: DateTime.utc(2023,6,12), endDate: DateTime.utc(2023,6,20), days: 0 },
            { name: 'Eastern Europe', startDate: DateTime.utc(2023,7,16), endDate: DateTime.utc(2023,9,30), days: 0 },
            { name: 'Iceland', startDate: DateTime.utc(2023,12,9), endDate: DateTime.utc(2023,12,21), days: 0 },
        ]
    }
}