import { inject } from "@angular/core";
import { HistoryService } from "./history.service";

export class AdditionService {
    readonly id = Math.ceil(Math.random() * 100000);
    readonly history = inject(HistoryService);

    add(a: number, b: number): number {
        this.history.audit(`Adding ${a} + ${b}`);
        return a + b;
    }
}