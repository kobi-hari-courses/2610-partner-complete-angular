export interface School {
    readonly classes: ClassRoom[];
}

export interface ClassRoom {
    readonly students: Student[];
    readonly name: string;
}

export interface Student {
    readonly id: string;
    readonly name: string;
    readonly topics: Topic[];
}

export interface Topic {
    readonly caption: string;
    readonly quizes: Quiz[];
}

export interface Quiz {
    readonly title: string;
    readonly grade: number;
}