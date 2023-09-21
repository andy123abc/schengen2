import { Injectable } from '@angular/core';
import { ITrip } from '../shared/trip';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { IInput } from '../shared/input';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private tripsUrl = 'api/trips/trips.json'; // URL to web api

  constructor(private http: HttpClient) {}

  getTrips(): Observable<IInput[]> {
    return this.http.get<IInput[]>(this.tripsUrl)
    .pipe(
      //tap((data) => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Promise<any> {
    console.error('An error occurred (service)', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
