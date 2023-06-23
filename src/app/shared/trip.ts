import { DateTime } from 'luxon';
export interface ITrip {
    name: string;
    startDate: DateTime;
    endDate: DateTime;
    days: number;
}