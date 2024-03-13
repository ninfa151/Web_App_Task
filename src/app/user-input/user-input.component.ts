import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss'
})

export class UserInputComponent {
  @Input() showingDesc: boolean | undefined;
  @Output() formValidityChange = new EventEmitter<boolean>();

  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  public emailMatcher = new MyErrorStateMatcher();
  public passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)])
  public passwordMatcher = new MyErrorStateMatcher();
  public pwHide = true;

  public constructor(
    private router: Router
  ) { }

  public moveToAcCreation(): void {
    this.router.navigateByUrl('ac-cre')
  }
  public checkFormValidity(): void {
    const isEmailValid = this.emailFormControl.valid;
    const isPasswordValid = this.passwordFormControl.valid;
    this.formValidityChange.emit(isEmailValid && isPasswordValid)
  }
}
