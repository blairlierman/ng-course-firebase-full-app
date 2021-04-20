import { Subject } from "rxjs/Subject";
import { Exercise } from "./exercise.model";

export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    
    private availableExercises: Exercise[] = [
        { id: "crunches", name: "Crunches", duration: 30, calories: 8},
        { id: "touch-toes", name: "Toe Touchies", duration: 180, calories: 15},
        { id: "side-lunges", name: "Side Lunges", duration: 120, calories: 18},
        { id: "burpees", name: "Burpees", duration: 60, calories: 8},
    ]

    private runningExercise!: Exercise | undefined;


    getAvailableExercises() {
        return this.availableExercises.slice();
    }

    startExercise(selectedId: string)
    {
        const selectedExercise = this.availableExercises.find(ex => ex.id == selectedId);
        this.runningExercise = selectedExercise;
        this.exerciseChanged.next(<Exercise>{ ...this.runningExercise });
    }
}