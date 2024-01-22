import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  isLogged = false;
  before: any;
  constructor(private router: Router, private activeroute: ActivatedRoute) {
    this.isLogged = localStorage.getItem('usuario') !== null ? true : false;

    this.activeroute.queryParams.subscribe(params => {
      if (this.isLogged && this.router.getCurrentNavigation()?.extras.state) {
        this.before = this.router.getCurrentNavigation()?.extras.state;
        const url = this.before.url;
        this.router.navigate(['/' + url]);
      } else if (this.isLogged) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit(): void {
  }

}

