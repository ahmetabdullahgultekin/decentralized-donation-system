import {TestBed} from '@angular/core/testing';

import {MetamaskService} from './web3.service';

describe('MetamaskService', () => {
  let service: MetamaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetamaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
