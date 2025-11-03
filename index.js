(function() {
  "use strict";
  function normalizeComponent(scriptExports, render, staticRenderFns, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const UPDATE_EVENTS = [
    "site.changeTitle",
    "page.changeTitle",
    "page.changeStatus",
    "model.update"
  ];
  function getStats() {
    return {
      total: 0,
      added: 0,
      untracked: 0,
      modified: 0,
      renamed: 0,
      deleted: 0
    };
  }
  const _sfc_main$3 = {
    data: () => {
      return {
        headline: null,
        stats: getStats()
      };
    },
    computed: {
      finalHeadline() {
        let text = this.headline;
        if (this.stats.total) {
          text += ` (${this.stats.total} changes)`;
        }
        return text;
      },
      link() {
        return this.$panel.url();
      },
      positiveStatus() {
        let text = [];
        if (this.stats.added) {
          text.push(`${this.stats.added} added`);
        }
        if (this.stats.untracked) {
          text.push(`${this.stats.untracked} untracked`);
        }
        if (text.length) {
          return text.join(", ");
        } else {
          return null;
        }
      },
      noticeStatus() {
        let text = [];
        if (this.stats.modified) {
          text.push(`${this.stats.modified} modified`);
        }
        if (this.stats.renamed) {
          text.push(`${this.stats.renamed} renamed`);
        }
        if (text.length) {
          return text.join(", ");
        } else {
          return null;
        }
      },
      negativeStatus() {
        if (this.stats.deleted) {
          return `${this.stats.deleted} deleted`;
        } else {
          return null;
        }
      },
      list() {
        let result = [];
        if (this.positiveStatus) {
          result.push({
            text: this.positiveStatus,
            image: {
              icon: "copy",
              back: "var(--color-positive)",
              color: "var(--color-gray-800)"
            }
          });
        }
        if (this.noticeStatus) {
          result.push({
            text: this.noticeStatus,
            image: {
              icon: "edit",
              back: "var(--color-notice)",
              color: "var(--color-gray-800)"
            }
          });
        }
        if (this.negativeStatus) {
          result.push({
            text: this.negativeStatus,
            image: {
              icon: "trash",
              back: "var(--color-negative)",
              color: "var(--color-gray-800)"
            }
          });
        }
        return result.map((result2) => ({
          ...result2,
          key: result2.image.icon
        }));
      }
    },
    created() {
      this.load().then((response) => {
        this.headline = response.headline;
        this.status();
      });
      UPDATE_EVENTS.forEach((e) => this.$events.$on(e, this.status));
    },
    destroyed() {
      UPDATE_EVENTS.forEach((e) => this.$events.$off(e, this.status));
    },
    methods: {
      status() {
        this.$api.get("git/status").then((entries) => {
          this.stats = getStats();
          if (entries.length) {
            this.updateStats(entries);
          }
        });
      },
      updateStats(entries) {
        this.stats.total = entries.length;
        entries.forEach((entry) => {
          let status = entry.staged || entry.unstaged;
          switch (status) {
            case "A":
              this.stats.added++;
              break;
            case "?":
              this.stats.untracked++;
              break;
            case "M":
              this.stats.modified++;
              break;
            case "R":
              this.stats.renamed++;
              break;
            case "D":
              this.stats.deleted++;
          }
        });
      }
    }
  };
  var _sfc_render$3 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("section", { staticClass: "k-section area-git-changes-list" }, [_c("header", { staticClass: "k-section-header" }, [_c("k-headline", [_vm._v(_vm._s(_vm.finalHeadline))]), _vm.list.length ? _c("k-button-group", [_c("k-button", { attrs: { "icon": "share", "link": _vm.link } }, [_vm._v("Open")])], 1) : _vm._e()], 1), _vm.list.length ? _c("k-items", { attrs: { "items": _vm.list } }) : [_c("k-empty", { attrs: { "icon": "check" } }, [_vm._v("No changes")])]], 2);
  };
  var _sfc_staticRenderFns$3 = [];
  _sfc_render$3._withStripped = true;
  var __component__$3 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$3,
    _sfc_render$3,
    _sfc_staticRenderFns$3,
    false,
    null,
    null
  );
  __component__$3.options.__file = "/Users/philipp/code/kirby-git-5/src/components/GitSection.vue";
  const GitSection = __component__$3.exports;
  const _sfc_main$2 = {
    props: {
      title: {
        type: String
      },
      data: {
        type: Array
      }
    },
    data() {
      return {
        perPage: 15,
        pageIdx: 0
      };
    },
    computed: {
      pages() {
        return this.data.reduce((acc, val, i) => {
          let idx = Math.floor(i / this.perPage);
          let page = acc[idx] || (acc[idx] = []);
          page.push(val);
          return acc;
        }, []);
      },
      page() {
        if (!this.pages[this.pageIdx]) {
          this.pageIdx = 0;
        }
        return this.pages[this.pageIdx];
      },
      entries() {
        if (!this.page) {
          return null;
        }
        return this.page.map((entry) => {
          let image = {
            back: "black",
            icon: "question",
            color: "var(--color-gray-800)"
          };
          switch (entry.mode) {
            case "?":
            case "A":
              image.back = "var(--color-positive)";
              image.icon = "copy";
              break;
            case "M":
              image.back = "var(--color-notice)";
              image.icon = "edit";
              break;
            case "R":
              image.back = "var(--color-notice)";
              image.icon = "refresh";
              break;
            case "D":
              image.back = "var(--color-negative)";
              image.icon = "trash";
          }
          return {
            text: entry.file,
            image
          };
        });
      }
    },
    methods: {
      changePage(data) {
        this.pageIdx = data.page - 1;
      }
    }
  };
  var _sfc_render$2 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("section", { staticClass: "area-git-changes-list" }, [_c("header", { staticClass: "k-section-header" }, [_c("k-headline", [_vm._v(_vm._s(_vm.title))]), _vm._t("action")], 2), _vm.entries ? _c("k-items", { attrs: { "items": _vm.entries } }) : [_c("k-empty", { attrs: { "icon": "check" } }, [_vm._v("No changes")])], _c("k-pagination", { attrs: { "align": "center", "details": true, "page": _vm.pageIdx + 1, "total": _vm.data.length, "limit": _vm.perPage }, on: { "paginate": _vm.changePage } })], 2);
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2,
    false,
    null,
    null
  );
  __component__$2.options.__file = "/Users/philipp/code/kirby-git-5/src/components/ChangesList.vue";
  const ChangesList = __component__$2.exports;
  const _sfc_main$1 = {
    props: {
      data: Object
    },
    data() {
      return {
        page: 1,
        limit: 15
      };
    },
    computed: {
      listItems() {
        var _a;
        return (_a = this.data) == null ? void 0 : _a.commits.map((commit) => ({
          key: commit.hash,
          text: commit.subject,
          info: commit.hash,
          image: {
            back: commit.new ? "green" : "black",
            icon: commit.new ? "upload" : "circle-filled",
            color: commit.new ? "gray-800" : "gray-500"
          }
        }));
      }
    },
    created() {
      this.$emit("paginate", {
        page: this.page,
        limit: this.limit
      });
    }
  };
  var _sfc_render$1 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("section", [_c("header", { staticClass: "k-section-header" }, [_c("k-headline", [_vm._v("Commits")]), _vm._t("action")], 2), _vm.listItems ? _c("k-items", { attrs: { "items": _vm.listItems } }) : [_c("k-empty", { attrs: { "icon": "circle-filled" } }, [_vm._v("No commits")])], _vm.data ? _c("k-pagination", _vm._g({ attrs: { "align": "center", "details": true, "page": _vm.page, "total": _vm.data.total, "limit": _vm.limit } }, _vm.$listeners)) : _vm._e()], 2);
  };
  var _sfc_staticRenderFns$1 = [];
  _sfc_render$1._withStripped = true;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1,
    false,
    null,
    "2a944adc"
  );
  __component__$1.options.__file = "/Users/philipp/code/kirby-git-5/src/components/CommitsList.vue";
  const CommitsList = __component__$1.exports;
  const _sfc_main = {
    components: {
      ChangesList,
      CommitsList
    },
    data() {
      return {
        staged: [],
        unstaged: [],
        commitData: {
          message: null
        },
        logData: null,
        logPgn: null,
        isPulling: false,
        isPushing: false
      };
    },
    computed: {
      canPull() {
        return !this.isPushing && !this.isPulling;
      },
      canPush() {
        var _a;
        return !this.isPushing && !this.isPulling && ((_a = this.logData) == null ? void 0 : _a.new);
      }
    },
    created() {
      this.$api.get("git/status").then((entries) => {
        this.updateStatus(entries);
      }).catch((error) => {
        this.$panel.notification.error(error);
      });
    },
    methods: {
      updateStatus(entries) {
        this.staged = [];
        this.unstaged = [];
        entries.forEach((entry) => {
          if (entry.unstaged) {
            this.unstaged.push({
              file: entry.file,
              mode: entry.unstaged
            });
          }
          if (entry.staged && entry.staged !== "?") {
            this.staged.push({
              file: entry.file,
              mode: entry.staged
            });
          }
        });
      },
      add() {
        this.$api.post("git/add").then(() => {
          return this.$api.get("git/status");
        }).then((entries) => {
          this.updateStatus(entries);
        });
      },
      commit() {
        this.$api.post("git/commit", this.commitData).then(() => {
          this.$refs.commitDialog.close();
          return this.$api.get("git/status");
        }).then((entries) => {
          this.commitData.message = null;
          this.updateStatus(entries);
        }).catch((error) => {
          this.$refs.commitDialog.error(error.message);
        }).then(() => {
          this.listCommits();
        });
      },
      paginateLog(data) {
        this.logPgn = {
          page: data.page,
          limit: data.limit
        };
        this.listCommits();
      },
      listCommits() {
        return this.$api.get("git/log", this.logPgn).then((data) => {
          this.logData = data;
        });
      },
      push() {
        this.isPushing = true;
        this.$api.post("git/push").then(() => {
          return this.listCommits();
        }).catch((error) => {
          this.$panel.notification.error(error);
        }).then(() => {
          this.isPushing = false;
        });
      },
      pull() {
        this.isPulling = true;
        this.$api.get("git/pull").then(() => {
          return this.listCommits();
        }).catch((error) => {
          this.$panel.notification.error(error);
        }).then(() => {
          this.isPulling = false;
        });
      }
    }
  };
  var _sfc_render = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("k-inside", [_c("k-panel-inside", [_c("k-header", [_vm._v("Version Control")]), _c("k-grid", { attrs: { "gutter": "medium" } }, [_c("k-column", { attrs: { "width": "1/3" } }, [_c("changes-list", { attrs: { "title": "Unstaged", "data": this.unstaged } }, [this.unstaged.length ? _c("k-button-group", { attrs: { "slot": "action" }, slot: "action" }, [_c("k-button", { attrs: { "icon": "add" }, on: { "click": _vm.add } }, [_vm._v("Add")])], 1) : _vm._e()], 1)], 1), _c("k-column", { attrs: { "width": "1/3" } }, [_c("changes-list", { attrs: { "title": "Staged", "data": this.staged } }, [this.staged.length ? _c("k-button-group", { attrs: { "slot": "action" }, slot: "action" }, [_c("k-button", { attrs: { "icon": "circle-filled" }, on: { "click": function($event) {
      return _vm.$refs.commitDialog.open();
    } } }, [_vm._v(" Commit ")])], 1) : _vm._e()], 1), _c("k-dialog", { ref: "commitDialog", attrs: { "theme": "positive" }, on: { "submit": function($event) {
      return _vm.$refs.commitForm.submit();
    } } }, [_c("k-form", { ref: "commitForm", attrs: { "fields": {
      message: {
        type: "text",
        label: "Message",
        required: true
      }
    } }, on: { "submit": _vm.commit }, model: { value: _vm.commitData, callback: function($$v) {
      _vm.commitData = $$v;
    }, expression: "commitData" } })], 1)], 1), _c("k-column", { attrs: { "width": "1/3" } }, [_c("commits-list", { attrs: { "data": _vm.logData }, on: { "paginate": _vm.paginateLog } }, [_c("k-button-group", { attrs: { "slot": "action" }, slot: "action" }, [_c("k-button", { attrs: { "icon": "download", "disabled": !_vm.canPull }, on: { "click": _vm.pull } }, [_vm._v(" " + _vm._s(_vm.isPulling ? "Pulling…" : "Pull") + " ")]), _c("k-button", { attrs: { "icon": "upload", "theme": "positive", "disabled": !_vm.canPush }, on: { "click": _vm.push } }, [_vm._v(" " + _vm._s(_vm.isPushing ? "Pushing…" : "Push") + " ")])], 1)], 1)], 1)], 1)], 1)], 1);
  };
  var _sfc_staticRenderFns = [];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns,
    false,
    null,
    null
  );
  __component__.options.__file = "/Users/philipp/code/kirby-git-5/src/components/GitView.vue";
  const GitView = __component__.exports;
  panel.plugin("oblik/git", {
    sections: {
      git: GitSection
    },
    components: {
      "k-git-view": GitView
    }
  });
})();
