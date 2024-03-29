import { BookImage } from "#/axios";

export const getImageURL = (
  book_id: string,
  store_images: Array<BookImage>,
) => {
  let img_res = store_images.filter((el) => el.id == book_id); // 从vuex获取书影数据
  return img_res[0].allowed
    ? `/data/images/thumbnails/${book_id}.jpg`
    : "/data/images/thumbnails/placeholder.jpg";
};
