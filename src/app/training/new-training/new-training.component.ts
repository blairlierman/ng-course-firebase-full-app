import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  
  exercises: Exercise[] = [];
  exerciseSubscription: Subscription = new Subscription;
  exercisesLoading = false;
  exercisesLoadingSubscription: Subscription = new Subscription();

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => { this.exercises = exercises;});
    this.exercisesLoadingSubscription = this.uiService.exercisesLoadingStateChanged.subscribe(exercisesLoading => {
       this.exercisesLoading = exercisesLoading;
    });
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm)
  {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if(this.exerciseSubscription) {this.exerciseSubscription.unsubscribe();}
    if(this.exercisesLoadingSubscription) {this.exercisesLoadingSubscription.unsubscribe(); }
  }
}
