import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate: Date;
  isLoading: boolean = false;
  private loadingSubs: Subscription = new Subscription;

  constructor(private authService: AuthService, private uiService: UIService) {
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.loadingSubs = this.uiService.loadingStateChange.subscribe(isLoading => {this.isLoading = isLoading;})
  }

  onSubmit(form: NgForm)
  {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    })
  }

  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }

}
