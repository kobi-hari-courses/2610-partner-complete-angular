import { Question } from "./models/question";

export function calculateCorrectAnswersCount(allQuestions: Question[], allAnswers: number[]): number {
    const correctAnswers = allAnswers.filter(
        (answer, index) => answer === allQuestions[index].correctAnswer);
    return correctAnswers.length;
}

export function calculateScore(correctAnswerCount: number, totalQuestionsCount: number): number {
    if (totalQuestionsCount === 0) {
        return 0;
    }
    return Math.round((correctAnswerCount / totalQuestionsCount) * 100);
}

