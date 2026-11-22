import { InjectionToken } from "@angular/core";

export interface Adder {
    readonly id: number;
    add(a: number, b: number): number;
}

export const ADDER = new InjectionToken<Adder>('ADDER');