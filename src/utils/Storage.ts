class Storage {
  async save(key: string, data: any): Promise<void> {
    return localStorage.setItem(key, JSON.stringify(data));
  }

  async load(
    key: string,
    defaultValue: any = undefined
  ): Promise<any | undefined> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  }

  async remove(key: string): Promise<void> {
    return localStorage.removeItem(key);
  }

  async purgeAllData(): Promise<void> {
    return localStorage.clear();
  }
}

export default new Storage();
