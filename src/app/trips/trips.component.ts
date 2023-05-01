import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ITrip } from "../shared/trip";

@Component({
    selector: 'sh-trips',
    templateUrl: './trips.component.html'
})
export class TripsComponent {
    @Input() trips: ITrip[] = [];
    @Output() removeTrip: EventEmitter<ITrip> = new EventEmitter<ITrip>();
    
    //methods
    removeAll(): void {
        this.removeTrip.emit(undefined);

    }
}