// export function addData(storeName: string, dataArr: unknown[], primaryKey: string) {
//   const openRequest = indexedDB.open("rare");

//   openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
//     console.log("indexedDB已升级", storeName);
//     const db: IDBDatabase = event.target!.result;
//     if (!db.objectStoreNames.contains(storeName)) db.createObjectStore(storeName, { keyPath: primaryKey });
//   };

//   openRequest.onerror = () => {
//     console.error("indexedDB打开失败", storeName);
//   };

//   openRequest.onsuccess = (event) => {
//     console.log("indexedDB已打开", storeName);
//     const db: IDBDatabase = event.target!.result;
//     const objStore = db.transaction(storeName, "readwrite").objectStore(storeName);
//     console.log(dataArr);
//     dataArr.forEach((dataItem) => {
//       const req = objStore.add(dataItem);
//     });
//   };
// }

const rare_stores = [
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

export function initIDB(stores: Array<{ name: string; primaryKey: string | string[] }> = rare_stores) {
  const openRequest = indexedDB.open("rare");

  return new Promise<any>((resolve, reject) => {
    openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log("indexedDB已升级");
      const db: IDBDatabase = event.target!.result;

      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store.name)) db.createObjectStore(store.name, { keyPath: store.primaryKey });
      });
    };

    openRequest.onsuccess = () => {
      resolve(openRequest);
    };
    openRequest.onerror = () => reject("indexedDB打开失败");
  });
}

function addData2Store(data: {}, store: IDBObjectStore) {
  return new Promise<void>((resolve, reject) => {
    const req = store.add(data);
    req.onsuccess = () => resolve();
    req.onerror = (event: Event) => reject(event.target.error);
  });
}

export async function addData(storeName: string, dataArr: {}[]) {
  const db = (await initIDB()).result;
  const transaction = db.transaction(storeName, "readwrite");
  const objStore = transaction.objectStore(storeName);

  let arr: Promise<void>[] = [];
  dataArr.forEach((dataItem) => {
    arr.push(addData2Store(dataItem, objStore));
  });
  Promise.all(arr).catch((err) => {
    console.warn(`${storeName}上传失败: ${err}`);
  });
  transaction.oncomplete = () => {
    console.log(`transaction ${storeName} completed!`);
  };
}

export function readData(storeName: string) {
  return new Promise(async (resolve, reject) => {
    const db = (await initIDB()).result;
    const transaction = db.transaction(storeName);
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
