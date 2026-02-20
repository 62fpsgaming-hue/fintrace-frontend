declare module 'vis-network/standalone' {
  export class DataSet<T> {
    constructor(data?: T[])
    add(data: T | T[]): string | string[]
    update(data: T | T[]): string | string[]
    remove(id: string | string[]): string[]
    get(id?: string): T | T[]
    length: number
  }

  export class Network {
    constructor(container: HTMLElement, data: { nodes: DataSet<unknown>; edges: DataSet<unknown> }, options?: Record<string, unknown>)
    on(event: string, callback: (params: Record<string, unknown>) => void): void
    off(event: string, callback: (params: Record<string, unknown>) => void): void
    destroy(): void
    getScale(): number
    moveTo(options: { scale?: number; position?: { x: number; y: number } }): void
    fit(options?: { animation?: boolean }): void
    getSelectedNodes(): string[]
  }
}
