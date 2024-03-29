interface queryItem {
  id: string | undefined;
  [n: string]: any;
}

export const id2name = (
  arr: queryItem[],
  id: string | undefined,
  dft: string,
) => {
  let r = arr.find((ele: queryItem) => ele.id == id);
  // if (r) return r.name;
  // else return dft;
  return r?.name || dft;
};
