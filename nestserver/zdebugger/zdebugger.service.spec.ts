import { Test, TestingModule } from '@nestjs/testing';
import { ZdebuggerService } from './zdebugger.service';

describe('ZdebuggerService', () => {
  let service: ZdebuggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZdebuggerService],
    }).compile();

    service = module.get<ZdebuggerService>(ZdebuggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
