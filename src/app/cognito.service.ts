import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, ICognitoStorage } from 'amazon-cognito-identity-js';

import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  private userPool: CognitoUserPool
  private _currentUser: any


  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: 'ap-northeast-1_ROC2kDec8',
      ClientId: '6he1vqt5d9kb439fnr94crqpg',
      Storage: sessionStorage
    })
  }

  public login(username: string, password: string): Promise<any> {
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: this.userPool,
      Storage: sessionStorage as ICognitoStorage
    })
    const authentificationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    })
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authentificationDetails, {
        onSuccess: (result) => {
          resolve('Login!');
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }

  public signUp(username: string, password: string): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      this.userPool.signUp(username, password, [], [], (err: any, result: any) => {
        if (err) {
          observer.error(err.message);
        } else {
          observer.next('signUp!');
          this._currentUser = new CognitoUser({
            Username: username,
            Pool: this.userPool
          });
        }
      });
    });
  }

  public confirmSignUp(code: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._currentUser.confirmRegistration(code, true, function (err: any, result: any) {
        if (err) {
          alert(err.message)
          reject(err.message)
        } else {
          resolve(result.message)
        }
      })
    })
  }
  
  public reConfirm(): Observable<any>{
    return new Observable((observer: Subscriber<any>) =>{
      this._currentUser.resendConfirmationCode((error: any, result: any)=>{
        if(error){
          observer.error(error.message)
          console.log('resend-crm-mail-error')
        }else{
          observer.next()
          console.log('resend!')
        }
      })
    })
  }

  public autoLogin(): Observable<any> {
    const currentUser = this.userPool.getCurrentUser()
    return new Observable((observer: Subscriber<any>) => {
      if (!currentUser) {
        observer.error('notExist')
        console.log('user not exist')
      } else {
        currentUser.getSession((err: any, resolve: any) => {
          if (err) {
            observer.error(err.message)
            console.log('session error')
          } else {
            observer.next(resolve)
            observer.complete()
            console.log('session verified')
          }
        })
      }
    })
  }
}