import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";

export class UIService {
    loadingStateChange: Subject<boolean>;
    exercisesLoadingStateChanged: Subject<boolean>;

    constructor() {
        this.loadingStateChange = new Subject();
        this.exercisesLoadingStateChanged = new Subject();
    }
}