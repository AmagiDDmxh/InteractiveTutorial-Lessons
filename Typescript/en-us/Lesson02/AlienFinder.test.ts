import BigNumber from 'bignumber.js';
import { withContracts } from '../neo-one/test';

describe('AlienFinder', () => {
  test('exist', async () => {
    await withContracts(async ({ alienFinder }) => {
      expect(alienFinder).toBeDefined();
    });
  });
  test('invoke', async () => {
    await withContracts(async ({ alienFinder }) => {
      // Test owner check
      let error: Error | undefined;
      try {
        await alienFinder.generateAlien.confirmed('hello');
      } catch (err) {
        error = err;
      }
      expect(error).toBeUndefined();

      // Test generation
      const receipt = await alienFinder.generateAlien.confirmed('someone');
      if (receipt.result.state === 'FAULT') {
        throw new Error(receipt.result.message);
      }
      expect(receipt.result.state).toEqual('HALT');
      expect(receipt.result.value).toBeUndefined();
      expect(receipt.events).toHaveLength(1);
      let event = receipt.events[0];
      expect(event.name).toEqual('generate');
      if (event.name !== 'generate') {
        throw new Error('For TS');
      }
      expect(event.parameters.id.toNumber()).toEqual(2);

      // Test query
      const someAlien = await alienFinder.query(new BigNumber(2));
      console.log(someAlien.alienName);
      expect(someAlien.alienName).toEqual('someone');
      expect(someAlien.id.toNumber()).toEqual(2);
    });
  });
});
