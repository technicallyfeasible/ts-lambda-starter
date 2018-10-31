type CallbackFunc = (...args: any[]) => any;

type PromiseFunc<TResult> = (...args: any[]) => Promise<TResult>;

/**
 * Wrap a function that expects a callback in a Promise
 * @param thisArg
 * @param func
 */
export function promisify<TResult = any>(thisArg: any, func: CallbackFunc): PromiseFunc<TResult> {
  return (...args) => {
    return new Promise<TResult>((resolve, reject) => {
      func.call(thisArg, ...args, (err, data: TResult) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  };
}
