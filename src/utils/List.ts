class List<T> {
    private items: Array<T>;

    constructor() {
        this.items = [];
    }

    public size(): number {
        return this.items.length;
    }

    public append(value: T): void {
        this.items.push(value);
    }

    public isEmpty(): boolean {
        return (this.size() == 0);
    }

    public get(index: number): T {
        return this.items[index];
    }

    public remove(index: number): boolean {
        
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }

        return false;
    }
}