import { AuthData } from "./auth-data.model";
import { User } from "./user.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { TrainingService } from "../training/training.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated: boolean = false;

    constructor(private router: Router, private afAuth: AngularFireAuth, 
        private trainingService: TrainingService,
        private snackbar: MatSnackBar) { }
    
    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }
            else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false);
                this.router.navigate(['/login']);
            }
        });
    }

    registerUser(authData: AuthData)
    {
        this.afAuth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            this.snackbar.open(error.message, undefined, {
                duration: 3000
            });
        });
    }

    login(authData: AuthData) {
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            this.snackbar.open(error.message, undefined, {
                duration: 3000
            });
        });
    }

    logout() {
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}