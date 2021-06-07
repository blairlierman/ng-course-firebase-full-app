import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = new FormGroup({});
  isLoading: boolean = false;
  private loadingSubs: Subscription = new Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {

  }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChange.subscribe(loading => { this.isLoading = loading; });
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

  ngOnDestroy(): void {
    if(this.loadingSubs) { this.loadingSubs.unsubscribe(); }
  }

}
