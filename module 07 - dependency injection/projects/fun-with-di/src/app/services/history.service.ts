import { effect, Inject, inject, Service, signal } from "@angular/core";
import { PREFIX } from "../tokens/prefix.token";

@Service()
export class HistoryService {
 
    readonly entries = signal<string[]>([]);
    readonly prefix = inject(PREFIX);

    audit(entry: string) {
        const line = `${this.prefix()} ${entry}`;
        this.entries.update(entries => [...entries, line]);        
    }

    constructor() {
        effect(() => {
           console.log('History', this.entries());
        })
    }
}