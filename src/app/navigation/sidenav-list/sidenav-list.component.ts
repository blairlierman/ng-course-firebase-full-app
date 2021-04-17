import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  close = new EventEmitter();
  isAuth: boolean = false;
  authSubscription! : Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onClose() {
    this.close.emit();
  }

  onLogout() {
    this.authService.logout();
    this.onClose();
  }

}
