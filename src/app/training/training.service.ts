import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map, take } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
import { Exercise } from "./exercise.model";
import * as fromTraining from './training.reducer'
import * as UI from '../shared/ui.actions'
import * as Training  from "./training.actions";

@Injectable()
export class TrainingService {

    private fbSubscriptions: Subscription[] = [];

    constructor(private db: AngularFirestore, private uiService: UIService,
      private store: Store<fromTraining.State>) {}

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
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
              this.store.dispatch(new UI.StopLoading());
              this.store.dispatch(new Training.SetAvailableTrainings(exercises))
            }, error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar('Fetching exercises failed, please try again later', undefined, 3000);
            })
        );
    }

    startExercise(selectedId: string)
    {
      this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
      this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
        if(exercise) {
            this.addDataToDatabase( {
                    ...exercise,
                    date: new Date(),
                    state: 'completed'
        })};
        this.store.dispatch(new Training.StopTraining());
      });

    }

    cancelExercise(progress: number) {
      this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
        if(exercise) {
              this.addDataToDatabase( {
                      ...exercise,
                      date: new Date(),
                      state: 'cancelled',
                      duration:  exercise.duration * (progress / 100),
                      calories:  exercise.calories * (progress / 100),
        })};
        this.store.dispatch(new Training.StopTraining());
      });
    }

    fetchCompletedOrCancelledExercises()
    {
        this.fbSubscriptions.push(
            this.db.collection<Exercise>('finishedExercises').valueChanges()
            .subscribe((exercises: Exercise[]) => {
              this.store.dispatch(new Training.SetFinishedTrainings(exercises))
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
