import { inject } from "@angular/core";
import { HistoryService } from "./history.service";
import { Adder } from "./adder";

export class WrongAdditionService implements Adder {
    readonly id = Math.ceil(Math.random() * 100000);
    readonly history = inject(HistoryService);

    add(a: number, b: number): number {
        this.history.audit(`Wrongly Adding ${a} + ${b}`);
        return a + b + 1;
    }
}