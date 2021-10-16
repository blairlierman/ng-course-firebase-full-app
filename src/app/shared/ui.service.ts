import { EventEmitter, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject } from "rxjs";

@Injectable()
export class UIService {
    // loadingStateChange: Subject<boolean>;
    exercisesLoadingStateChanged: Subject<boolean>;

    constructor(private snackbar: MatSnackBar) {
        // this.loadingStateChange = new Subject();
        this.exercisesLoadingStateChanged = new Subject();
    }

    showSnackbar(message: string, action: string | undefined, duration: number)
    {
        this.snackbar.open(message, action, {
            duration: duration
        })
    }
}
