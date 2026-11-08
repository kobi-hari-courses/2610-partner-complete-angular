import { School } from "../models/school";
import { change, changeItemIf, mutate } from "./immutables";
import { Updater } from "./updater";

export function updateClassRoomName(oldName: string, newName: string): Updater<School> {
    return school => change(school, s => ({
        classes: changeItemIf(s.classes, 
            cls => cls.name === oldName, 
            _ => ({ name: newName }))
    }))
}

export function upgradeQuiz(className: string, studentId: string, topic: string, quizTitle: string): Updater<School> {
    return school => mutate(school, s => {
        const cls = s.classes.find(c => c.name === className);
        if (!cls) return;

        const student = cls.students.find(s => s.id === studentId);
        if (!student) return;

        const course = student.topics.find(c => c.caption === topic);
        if (!course) return;

        const quiz = course.quizes.find(q => q.title === quizTitle);
        if (!quiz) return;
        quiz.grade++;
    });
}