import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { TrainingService } from '../training.service';
import { StopTrainingComponent } from './stop-training.component';
import * as fromTraining from '../training.reducer'
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer!: number | ReturnType<typeof setInterval>

  constructor(private dialog: MatDialog, private trainingService: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  private startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
        const step = (exercise?.duration || 0) / 100 * 1000;
        this.timer = setInterval(() => {
          this.progress = this.progress + 1;
          if (this.progress >= 100) {
            this.trainingService.completeExercise();
            clearInterval(<number>this.timer);
          }
        }, step);
      }
    );

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
