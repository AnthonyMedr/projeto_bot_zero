type FunctionWithParams = {
    func: (...args: any[]) => Promise<void>;
    params: any[];
  };
  
  const fila: FunctionWithParams[] = [];
  let simultaneo = 1;
  
  setInterval(async () => {
    if (simultaneo <= 0) return;
    if (!fila.length) return;
    
    const { func, params } = fila.shift()!;
    simultaneo--;
    if (func) {
        await func(...params);
    }
    simultaneo++;
  }, 500);
  
  export function addToQueue(func: (...args: any[]) => Promise<void>, ...params: any[]) {
    fila.push({ func, params });
  }
  