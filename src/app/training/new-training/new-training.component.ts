import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  
  exercises: Observable<any> = new Observable<any>();

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.exercises = 
      this.db.collection("availableExercises").snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data() as {}
            } 
          })
        })
      )
  }

  onStartTraining(form: NgForm)
  {
    this.trainingService.startExercise(form.value.exercise);
  }

}
