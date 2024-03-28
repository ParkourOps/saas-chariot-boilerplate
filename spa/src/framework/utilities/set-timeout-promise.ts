type Function<Args extends [], T> = (...args: Args)=>T;
export default <Args extends [], T>(ms: number, fnc: Function<Args, T>, ...args: Args) => new Promise<T>((resolve)=>setTimeout(()=>{
    resolve(fnc(...args));
}, ms));
