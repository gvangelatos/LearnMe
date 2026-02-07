import { TestBed } from '@angular/core/testing';

import { AffirmationToastService } from './affirmation-toast.service';

describe('AffirmationToastService', () => {
  let service: AffirmationToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffirmationToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
