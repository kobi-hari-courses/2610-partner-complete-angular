import { effect, Service, signal } from "@angular/core";

@Service()
export class HistoryService {
    readonly entries = signal<string[]>([]);

    audit(entry: string) {
        this.entries.update(entries => [...entries, entry]);        
    }

    constructor() {
        effect(() => {
           console.log('History', this.entries());
        })
    }
}