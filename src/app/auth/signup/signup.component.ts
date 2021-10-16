import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as fromRoot from '../../app.reducer'
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  maxDate: Date;
  isLoading$: Observable<boolean> | undefined;

  constructor(private authService: AuthService, private uiService: UIService,
    private store: Store<fromRoot.State>) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }

  onSubmit(form: NgForm)
  {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    })
  }
}
