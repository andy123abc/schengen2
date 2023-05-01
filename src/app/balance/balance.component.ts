import { Component, Input } from "@angular/core";
import { IDate } from "../shared/date";

@Component({
    selector: 'sh-balance',
    templateUrl: './balance.component.html'
})
export class BalanceComponent {
    @Input() dates: IDate[] = [];

    
}