import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Subscription, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise | null>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    
    private availableExercises: Exercise[] = [];
    private runningExercise!: Exercise | undefined | null;
    private fbSubscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService) {}

    fetchAvailableExercises() {
        this.uiService.exercisesLoadingStateChanged.next(true);
        this.fbSubscriptions.push(
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
                this.uiService.exercisesLoadingStateChanged.next(false);
            }, error => {
                this.uiService.loadingStateChange.next(false);
                this.uiService.showSnackbar('Fetching exercises failed, please try again later', undefined, 3000);
            })
        );
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

    fetchCompletedOrCancelledExercises()
    {
        this.fbSubscriptions.push(
            this.db.collection<Exercise>('finishedExercises').valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
            })
        );
    }

    cancelSubscriptions()
    {
        this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise)
    {
        this.db.collection('finishedExercises').add(exercise);
    }
}