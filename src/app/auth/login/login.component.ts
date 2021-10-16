import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import * as fromApp from '../../app.reducer'
import { map } from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  isLoading$!: Observable<boolean>;
  private loadingSubs: Subscription = new Subscription;

  constructor(private authService: AuthService, private uiService: UIService,
    private store: Store<{ui: fromApp.State }>) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(
      map((state: { ui: { isLoading: boolean; }; }) => state.ui.isLoading)
    );
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required] }),
    })
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    })
  }
}
