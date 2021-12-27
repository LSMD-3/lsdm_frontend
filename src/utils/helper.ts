export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function cacheImages(scrArray: string[]) {
  const promises = scrArray.map((src) => {
    return new Promise(function (resolve: any, reject: any) {
      const img = new Image();
      img.src = src;
      img.onload = resolve();
      img.onerror = reject();
    });
  });

  return await Promise.all(promises);
}
