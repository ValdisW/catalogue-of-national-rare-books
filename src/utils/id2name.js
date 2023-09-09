export const id2name = (arr, id, dft) => {
  let r = arr.find((ele) => ele.id == id);
  if (r) return r.name;
  else return dft;
};
