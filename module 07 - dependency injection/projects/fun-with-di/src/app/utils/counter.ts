import { DestroyRef, inject } from "@angular/core";

export function startCounter(action: () => void) {
    const onDestroy = inject(DestroyRef);
    const id = setInterval(action, 2000);
    onDestroy.onDestroy(()=> clearInterval(id));

}