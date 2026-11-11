type Predicate<T> = (item: T) => boolean;
type Projector<T> = (item: T) => Partial<T>;

export function change<T>(item: T, changes: Projector<T>): T {
    return { ...item, ...changes(item) };
}
export function addItem<T>(items: readonly T[], newItem: T): readonly T[] {
  return [...items, newItem];
}

export function removeItem<T>(items: readonly T[], matches: Predicate<T>): readonly T[] {
  return items.filter((item) => !matches(item));
}

export function changeItemIf<T>(items: readonly T[], 
    matches: Predicate<T>, 
    changes: Projector<T>
) {
    return items.map(item => matches(item) 
        ? change(item, changes)
        : item
    );
}

