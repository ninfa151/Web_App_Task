import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CognitoService } from '../cognito.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-c',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login-c.component.html',
  styleUrl: './login-c.component.scss'
})
export class LoginCComponent {
  public showPwDesc = false;
  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  public emailMatcher = new MyErrorStateMatcher();
  public passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[-^$*.[\]{}()?\"!@#%&/\\,><':;|_~`+=])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d-^$*.[\]{}()?\"!@#%&/\\,><':;|_~`+=]{8,}$/)])
  public passwordMatcher = new MyErrorStateMatcher();
  public pwHide = true;
  public showingDesc: boolean = false;
  public isBtnActive = false;

  public constructor(
    private router: Router,
    private cognito: CognitoService
  ) { }

  public checkFormValidity(): void {
    const isEmailValid = this.emailFormControl.valid;
    const isPasswordValid = this.passwordFormControl.valid;
    this.isBtnActive = (isEmailValid && isPasswordValid)
  }


  public moveToAcCreation() {
    this.router.navigateByUrl('ac-cre')
  }

  public async login(username: string, password: string): Promise<any> {
    try {
      const result = await this.cognito.login(username, password)
        .then(() => {
          this.router.navigateByUrl('task-mnmt')
        }).catch(() => {

        })
    } catch (e) {
      console.log(e)
    }
  }
}

