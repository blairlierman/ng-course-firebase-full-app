import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Observable } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import * as fromTraining from '../training.reducer'
import * as fromRoot from '../../app.reducer'
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  exercises$: Observable<Exercise[]> | undefined;
  isLoading$: Observable<boolean> | undefined;

  constructor(private trainingService: TrainingService, private uiService: UIService,
    private store: Store<fromRoot.State>) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  fetchExercises()
  {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm)
  {
    this.trainingService.startExercise(form.value.exercise);
  }
}
