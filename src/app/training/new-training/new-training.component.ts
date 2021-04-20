import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  @Output() trainingStart = new EventEmitter();

  constructor(private trainingService: TrainingService) { }
  exercises: Exercise[] = [];

  ngOnInit(): void {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStartTraining()
  {
    this.trainingStart.emit();
  }

}
