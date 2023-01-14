class Dictionary<TKey, TValue> {
    data = new Map<string, TValue>();

    constructor(
        private readonly keySerializer: (key: TKey) => string
    ) { }

    set(key: TKey, value: TValue) {
        this.data.set(this.keySerializer(key), value);
    }

    get(key: TKey): TValue | undefined {
        return this.data.get(this.keySerializer(key));
    }

    has(key: TKey): boolean {
        return this.data.has(this.keySerializer(key));
    }
}