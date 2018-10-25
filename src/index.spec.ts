import * as index from './index';

describe('Index', () => {
  it('exports a "handler" function', () => {
    expect(typeof index.handler).toBe('function');
  });
});
