import { ComponentFixture, TestBed } from '@angular/core/testing';
import { profileClient } from './profileClient';

describe('profileClient', () => {
  let fixture: ComponentFixture<profileClient>;
  let component: profileClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [profileClient],
    }).compileComponents();

    fixture = TestBed.createComponent(profileClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should switch tabs when a tab button is clicked', () => {
    const settingsButton = fixture.nativeElement.querySelector('#settings-tab') as HTMLButtonElement;
    const overviewPane = fixture.nativeElement.querySelector('#overview-content');
    const settingsPane = fixture.nativeElement.querySelector('#settings-content');

    settingsButton.click();
    fixture.detectChanges();

    expect(settingsButton.classList.contains('bg-primary')).toBeTrue();
    expect(overviewPane.classList.contains('hidden')).toBeTrue();
    expect(settingsPane.classList.contains('hidden')).toBeFalse();
  });
});
