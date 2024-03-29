const stores = [
  { name: "books", primaryKey: "id" },
  { name: "persons", primaryKey: "id" },
  { name: "all_action", primaryKey: "id" },
  { name: "all_edition_dynasty", primaryKey: "id" },
  { name: "all_document_type", primaryKey: "id" },
  { name: "all_catalogue", primaryKey: "id" },
  { name: "all_edition_type", primaryKey: "id" },
  { name: "all_language", primaryKey: "id" },
  { name: "all_province", primaryKey: "id" },
  { name: "all_institution", primaryKey: "id" },
  { name: "all_image", primaryKey: ["id", "filename"] },
  { name: "person_ralations", primaryKey: "rid" },
];

export function initIDB() {
  const openRequest = indexedDB.open("rare", 1); // 打开或创建

  return new Promise<any>((resolve, reject) => {
    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log("indexedDB已升级");
      const db: IDBDatabase = event.target!.result;

      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store.name))
          db.createObjectStore(store.name, { keyPath: store.primaryKey });
      });
    };

    openRequest.onsuccess = () => {
      resolve(openRequest);
    };
    openRequest.onerror = () => reject("indexedDB打开失败");
  });
}

/**
 * 向某个IDBObjectStore添加一条数据
 *
 * @param {{}} data - 要添加的数据，对象格式
 * @param {IDBObjectStore} store - IDBObjectStore形式的store，可以通过transaction.objectStore(storeName)获取
 * @return {Promise<void>} A promise that resolves when the data is successfully added, and rejects if an error occurs.
 */
function addData2ObjectStore(data: {}, store: IDBObjectStore): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const req = store.add(data);
    req.onsuccess = () => resolve();
    req.onerror = (event: Event) => reject(event.target.error);
  });
}

function addManyData2ObjectStore(dataArr: {}[], store: IDBObjectStore) {
  return Promise.all(
    dataArr.map((data) => addData2ObjectStore(data, store)),
  ).catch((err) => {
    console.warn(`上传失败: ${err}`);
  });
}

/**
 * 向某个store中添加数据
 *
 * @param {string} storeName - store名称
 * @param {{}[]} dataArr - 要添加的数据，对象数组格式
 * @return {Promise<void>} A Promise that resolves when all data is added successfully.
 */
export async function addData(storeName: string, dataArr: {}[]): Promise<void> {
  const db: IDBDatabase = (await initIDB()).result;
  const transaction = db.transaction(storeName, "readwrite");
  const objStore = transaction.objectStore(storeName);

  let arr: Promise<void>[] = [];
  dataArr.forEach((dataItem) => {
    arr.push(addData2ObjectStore(dataItem, objStore));
  });
  Promise.all(arr).catch((err) => {
    console.warn(`${storeName}上传失败: ${err}`);
  });
  transaction.oncomplete = () => {
    console.log(`transaction ${storeName} completed!`);
  };
}

/**
 * 向多个store中添加数据
 *
 * @param {string[]} storeNames - 一组store的名称
 * @param {{}[][]} dataArr - 一组对象数组
 * @return {Promise<{}[]>} - A promise that resolves to an array of the added data arrays.
 */
export async function addManyData(storeNames: string[], dataArr: {}[][]) {
  const db: IDBDatabase = (await initIDB()).result;
  const transaction: IDBTransaction = db.transaction(storeNames, "readwrite");

  return await (() =>
    Promise.all(
      storeNames.map((storeName, i) =>
        addManyData2ObjectStore(dataArr[i], transaction.objectStore(storeName)),
      ),
    )
      .then((d) => d)
      .catch((e) => console.error(e)))();
}

/**
 * 读取单个store的数据
 *
 * @param {string} storeName - store的名称
 * @return {Promise<Array<{}>>} A promise that resolves with an array of objects from the store, or an empty array if no data is found
 */
export function readData(storeName: string): Promise<Array<{}>> {
  return new Promise(async (resolve, reject) => {
    const db: IDBDatabase = (await initIDB()).result;
    const transaction: IDBTransaction = db.transaction(storeName);
    const objStore: IDBObjectStore = transaction.objectStore(storeName);
    let request = objStore.getAll();

    request.onerror = function () {
      reject("读取失败");
    };

    request.onsuccess = function () {
      if (request.result) {
        resolve(request.result);
      } else resolve([]);
    };
  });
}

/**
 * 读取多个store的数据
 *
 * @param {string[]} storeNames - 一组store的名称
 * @return {Promise<any[]>} A promise that resolves to an array of data read from the object stores.
 */
export async function readManyData(storeNames: string[]) {
  const db: IDBDatabase = (await initIDB()).result;
  const transaction: IDBTransaction = db.transaction(storeNames);

  return await (() =>
    Promise.all(
      storeNames.map(
        (storeName) =>
          new Promise((resolve, reject) => {
            let req = transaction.objectStore(storeName).getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject("读取失败");
          }),
      ),
    )
      .then((d) => d)
      .catch((e) => console.error(e)))();
}

/**
 * 判断某几个store中是否都有数据
 *
 * @param {Iterable<string>} stores - 一组store的名称
 * @return {Promise<any>} A promise that resolves with the data if it exists, or rejects with an error message if the read operation fails.
 */
export async function haveData(stores: string[]) {
  const db: IDBDatabase = (await initIDB()).result;
  const transaction: IDBTransaction = db.transaction(stores);

  return await (() =>
    Promise.all(
      stores.map(
        (storeName: string) =>
          new Promise((resolve, reject) => {
            let req = transaction.objectStore(storeName).getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject("读取失败");
          }),
      ),
    )
      .then((d) => {
        return d.every((data) => data.length > 0);
      })
      .catch((e) => {
        console.error(e);
      }))();
}
