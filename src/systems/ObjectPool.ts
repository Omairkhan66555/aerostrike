export interface Poolable {
  active: boolean;
  spawn(...args: unknown[]): void;
  despawn(): void;
}

export class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private createFn: () => T;

  constructor(createFn: () => T, initialSize: number = 20) {
    this.createFn = createFn;
    for (let i = 0; i < initialSize; i++) {
      const obj = this.createFn();
      obj.active = false;
      this.pool.push(obj);
    }
  }

  public get(...args: unknown[]): T {
    let item = this.pool.find((i) => !i.active);
    if (!item) {
      item = this.createFn();
      this.pool.push(item);
    }
    item.active = true;
    item.spawn(...args);
    return item;
  }

  public getActive(): T[] {
    return this.pool.filter((i) => i.active);
  }

  public clear(): void {
    this.pool.forEach((item) => item.despawn());
  }
}
