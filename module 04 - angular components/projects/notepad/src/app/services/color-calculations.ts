import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { getContrastingGray } from "../utils/colors";

export function getSlowGray(color: string): Observable<string> {
    return of(color).pipe(
        delay(2000), 
        map(c => getContrastingGray(c))
    )

} 