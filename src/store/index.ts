import { App } from "vue";
import { createPinia, defineStore } from "pinia";
import { BookImage, RelatedPerson, Book } from "#/axios";
import { addData, readData } from "./idb";

export const useStore = defineStore("rare", {
  state: () => ({
    books: [] as Array<Book>,
    persons: [] as Array<RelatedPerson>,
    person_ralations: [],
    all_action: [],
    all_document_type: [],
    all_edition_type: [],
    all_language: [],
    all_edition_dynasty: [],
    all_institution: [],
    all_province: [],
    all_catalogue: [],
    all_image: [] as Array<BookImage>,
    rem: null,
  }),
  getters: {},
  actions: {
    // async fetchBooks() {
    //   const response = await fetch("/api/books");
    //   this.books = await response.json();
    // },
    loadIntroductionData(_data) {
      this.persons = _data;
    },
    preloadIntroductionData(_data) {
      let temp = [];
      [
        temp,
        this.all_edition_dynasty,
        this.all_document_type,
        this.all_catalogue,
        this.all_edition_type,
        this.all_language,
        this.all_province,
        this.all_institution,
        this.all_image,
      ] = _data;
    },
    loadExplorationData(_data) {
      [
        this.all_document_type,
        this.all_edition_type,
        this.all_language,
        this.all_edition_dynasty,
        this.all_province,
        this.all_institution,
        this.all_image,
        this.persons,
        this.all_action,
      ] = _data;
    },
    loadRelationshipData(_data) {
      [
        this.books,
        this.persons,
        this.all_document_type,
        this.all_language,
        this.all_edition_dynasty,
        this.all_province,
        this.all_institution,
        this.person_ralations,
        this.all_action,
        this.all_image,
      ] = _data;
    },
    changeRem(payload) {
      this.rem = payload;
    },
  },
});

const store = createPinia();
export function setupStore(app: App) {
  app.use(store);
}

export { store };
