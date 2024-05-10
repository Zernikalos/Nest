import { Test, TestingModule } from '@nestjs/testing';
import { ZdebuggerController } from './zdebugger.controller';

describe('ZdebuggerController', () => {
  let controller: ZdebuggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZdebuggerController],
    }).compile();

    controller = module.get<ZdebuggerController>(ZdebuggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
