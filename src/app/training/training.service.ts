import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    
    private availableExercises: Exercise[] = [];

    private runningExercise!: Exercise | undefined | null;
    private exercises: Exercise[] = [];

    constructor(private db: AngularFirestore) {}

    fetchAvailableExercises() {
        this.db.collection("availableExercises")
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data() as {}
              } as Exercise
            })
          })
        )
        .subscribe((exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        });
    }

    startExercise(selectedId: string)
    {
        const selectedExercise = this.availableExercises.find(ex => ex.id == selectedId);
        this.runningExercise = selectedExercise;
        this.exerciseChanged.next(<Exercise>{ ...this.runningExercise });
    }

    completeExercise() {
        if(this.runningExercise) {
            this.addDataToDatabase( {
                    ...this.runningExercise, 
                    date: new Date(),
                    state: 'completed'    
        })};
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        if(this.runningExercise) {
            this.addDataToDatabase( {
                    ...this.runningExercise, 
                    date: new Date(),
                    state: 'cancelled',
                    duration:  this.runningExercise.duration * (progress / 100),   
                    calories:  this.runningExercise.calories * (progress / 100),   
        })};
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    getCompletedOrCancelledExercises()
    {
        return this.exercises.slice();
    }

    private addDataToDatabase(exercise: Exercise)
    {
        this.db.collection('finishedExercises').add(exercise);
    }
}