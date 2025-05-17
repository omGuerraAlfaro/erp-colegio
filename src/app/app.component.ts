import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Intranet CACH';
  private MAX_SESSION = 2 * 60 * 60 * 1000; // 2 horas en ms

  constructor(private auth: AuthService) { }

  ngOnInit() {
    const ts = localStorage.getItem('loginTimestamp');
    if (!ts) this.auth.logout();
    const elapsed = Date.now() - Number(ts);

    if (elapsed >= this.MAX_SESSION) {
      this.auth.logout();
    } else {
      this.auth.userLoggedIn.next(true);
      this.auth.autoLogout(this.MAX_SESSION - elapsed);
    }
  }
}
