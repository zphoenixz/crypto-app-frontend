import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private api: ApiService,
    private router: Router,
    private toastrSvc: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  logOut() {
    this.toastrSvc.success('Logged Out!');
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
