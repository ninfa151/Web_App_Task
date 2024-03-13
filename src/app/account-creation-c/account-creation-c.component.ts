import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ErrorStateMatcher } from '@angular/material/core';
import { CognitoService } from '../cognito.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-account-creation-c',
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
    MatButtonModule,
    MatStepperModule
  ],
  templateUrl: './account-creation-c.component.html',
  styleUrl: './account-creation-c.component.scss'
})
export class AccountCreationCComponent {

  public showPwDesc = false;

  public loginString: string = "";

  public emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  public emailMatcher = new MyErrorStateMatcher();

  public passwordFormControl = new FormControl(
    '',
    [Validators.required,
    Validators.minLength(8),
    Validators.maxLength(20),
    Validators.pattern(/^(?=.*[-^$*.[\]{}()?\"!@#%&/\\,><':;|_~`+=])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d-^$*.[\]{}()?\"!@#%&/\\,><':;|_~`+=]{8,}$/)
    ])

  public passwordMatcher = new MyErrorStateMatcher();

  public pwHide = true;

  public showingDesc: boolean = true;

  public isBtnActive = false;

  public firstFormGroup = new FormGroup({
    passCtrl: this.passwordFormControl,
    emailCtrl: this.emailFormControl
  });

  public secondCtrl = new FormControl(
    '',
    [
      Validators.required,
      Validators.pattern(/^(?=.*\d)[\d]{1,}$/)
    ]);

  public cfmMatcher = new MyErrorStateMatcher();

  public secondFormGroup = new FormGroup({
    secondCtrl: this.secondCtrl
  });

  public thirdFormGroup = this._formBuilder.group({
    thirdCtrl: []
  })

  public isLinear = false;

  public steps = {
    first: true,
    second: false,
    third: false
  }

  public isMoreInfoConfirmation = {
    errorDesc: false,
    mailsentDesc: false
  }

  public constructor(
    private router: Router,
    private cognitoService: CognitoService,
    private _formBuilder: FormBuilder

  ) { }

  public checkFormValidity(): void {
    const isEmailValid = this.emailFormControl.valid;
    const isPasswordValid = this.passwordFormControl.valid;
    this.isBtnActive = (isEmailValid && isPasswordValid)
  }

  public onClickGoConfirmation(username: string, password: string, stepper: MatStepper) {
    this.addUserToPool(username, password, stepper)
  }

  private addUserToPool(username: string, password: string, prmStepper: MatStepper) {
    this.cognitoService.signUp(username, password).subscribe({
      next: (resolve) => {
        this.checkStepCompleted(1)
        prmStepper.selectedIndex = 1
      },
      error: (err) => {
        console.log('addUserToPool-error')
      }
    })
  }

  public onClickConfirm(code: string, stepper: MatStepper) {
    this.cognitoService.confirmSignUp(code)
      .then((result) => {
        this.checkStepCompleted(2)
        stepper.selectedIndex = 2
        console.log(result.message)
      })
      .catch((error) => {
        this.showCofirmErrorState()
        console.log(error.message)
      })
  }

  public resendCrmMail() {
    this.cognitoService.reConfirm().subscribe({
      next: (resollve) => {
        this.isMoreInfoConfirmation.mailsentDesc = true
      }, error: (err) => {
        console.log('resendCrmMail-error')
      }
    })
  }

  private showCofirmErrorState() {
    this.isMoreInfoConfirmation.errorDesc = true;
    this.secondCtrl.reset();
  }

  private checkStepCompleted(stepIndex: number): void {
    switch (stepIndex) {
      case 1:
        this.steps.first = false
        this.steps.second = true
        break
      case 2:
        this.steps.second = false
        this.steps.third = true
        break
      default:
        break
    }
  }

  public navigateLogin() {
    this.router.navigateByUrl('')
  }
}
