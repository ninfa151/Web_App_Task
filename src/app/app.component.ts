import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CognitoService } from './cognito.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TaskDragon';

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) { }
  ngOnInit(): void {
    this.cognitoService.autoLogin().subscribe({
      next: () => {
        this.router.navigateByUrl('task-mnmt')
      },
      error: () => {
        this.router.navigateByUrl('')
      }
    })
  }
}
