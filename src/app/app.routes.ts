import { Routes } from '@angular/router';
import { LoginCComponent } from './login-c/login-c.component';
import { AccountCreationCComponent } from './account-creation-c/account-creation-c.component';
import { TaskManagementComponent } from './task-management/task-management.component';

export const routes: Routes = [
    {path: '', component: LoginCComponent},
    {path: 'ac-cre', component: AccountCreationCComponent},
    {path: 'task-mnmt', component: TaskManagementComponent}
];
