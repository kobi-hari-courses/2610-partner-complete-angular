import { School } from "../models/school";

export const EXAMPLE_SCHOOL: School = {
    classes: [
        {
            name: "Grade 8 - Maple",
            students: [
                {
                    id: "student-001",
                    name: "Avery Chen",
                    topics: [
                        {
                            caption: "Mathematics",
                            quizes: [
                                { title: "Fractions", grade: 92 },
                                { title: "Geometry", grade: 87 },
                            ],
                        },
                        {
                            caption: "Science",
                            quizes: [{ title: "Ecosystems", grade: 95 }],
                        },
                    ],
                },
                {
                    id: "student-002",
                    name: "Jordan Patel",
                    topics: [
                        {
                            caption: "Mathematics",
                            quizes: [
                                { title: "Fractions", grade: 84 },
                                { title: "Geometry", grade: 90 },
                            ],
                        },
                        {
                            caption: "English",
                            quizes: [{ title: "Short Stories", grade: 88 }],
                        },
                    ],
                },
            ],
        },
        {
            name: "Grade 8 - Cedar",
            students: [
                {
                    id: "student-003",
                    name: "Morgan Rivera",
                    topics: [
                        {
                            caption: "Science",
                            quizes: [
                                { title: "Ecosystems", grade: 91 },
                                { title: "Forces", grade: 86 },
                            ],
                        },
                        {
                            caption: "English",
                            quizes: [{ title: "Short Stories", grade: 94 }],
                        },
                    ],
                },
                {
                    id: "student-004",
                    name: "Riley Thompson",
                    topics: [
                        {
                            caption: "Mathematics",
                            quizes: [{ title: "Geometry", grade: 89 }],
                        },
                        {
                            caption: "Science",
                            quizes: [{ title: "Forces", grade: 82 }],
                        },
                    ],
                },
            ],
        },
    ],
};