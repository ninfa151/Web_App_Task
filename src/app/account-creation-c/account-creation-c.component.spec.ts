import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreationCComponent } from './account-creation-c.component';

describe('AccountCreationCComponent', () => {
  let component: AccountCreationCComponent;
  let fixture: ComponentFixture<AccountCreationCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountCreationCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountCreationCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
