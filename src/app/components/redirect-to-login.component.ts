import {} from './auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  template: `<div>Loading ...</div>`,
})
export class RedirectToLoginComponent {
  constructor() {}

  ngOnInit() {
    window.location.href = 'http://localhost:3000/login.html';
  }
}
