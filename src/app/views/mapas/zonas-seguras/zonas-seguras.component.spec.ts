import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonasSegurasComponent } from './zonas-seguras.component';

describe('ZonasSegurasComponent', () => {
  let component: ZonasSegurasComponent;
  let fixture: ComponentFixture<ZonasSegurasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonasSegurasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZonasSegurasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
