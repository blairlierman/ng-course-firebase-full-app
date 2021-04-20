import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer!: number | ReturnType<typeof setInterval>

  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  private startOrResumeTimer() {
    const step = ((<Exercise>this.trainingService.getRunningExercise()).duration || 0) / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(<number>this.timer);
      }
    }, step);
  }

  onStopTraining()
  {
    clearInterval(<number>this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {data: {
      progress: this.progress
    }})

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.trainingService.cancelExercise(this.progress);
      }
      else
      {
        this.startOrResumeTimer();
      }
    })
  }


}
