import { TestBed } from '@angular/core/testing';

import { FlowBuilderService } from './flow-builder.service';

describe('FlowBuilderService', () => {
  let service: FlowBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlowBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
