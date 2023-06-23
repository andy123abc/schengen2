import { DateTime } from 'luxon';
export interface IDate {
    date: DateTime;
    tripName: string;
    isInSchengen: boolean;
    balance: number;
    date180Future: DateTime;
    date180Past: DateTime;
}