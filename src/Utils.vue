<script>
export default {
  methods: {
    getPersonNameById(id) {
      let r = this.$store.state.persons.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知人名";
    },
    getBookNameById(id) {
      let r = this.$store.state.books.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知书名";
    },
    getActionNameById(id) {
      let r = this.$store.state.all_action.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知行为";
    },
    getDocumentTypeNameById(id) {
      let r = this.$store.state.all_document_type.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知行为";
    },
    getEditionDynastyNameById(id) {
      let r = this.$store.state.all_edition_dynasty.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知行为";
    },
    getInstitutionNameById(id) {
      let r = this.$store.state.all_institution.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知行为";
    },
    getLanguageNameById(id) {
      let r = this.$store.state.all_language.find((e) => e.id == id);
      if (r) return r.name;
      else return "未知语言";
    },
  },
};
</script>
