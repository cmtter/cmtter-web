module.exports = function () {
  return {
    name: 'transform-remove-strict-mode',
    generatorOverride: function (ast, opts, code, defaultGen) {

    },
    post: function (file) {

    },
    visitor: {
      Program: {
        exit: function exit(path) {
          var list = path.node.directives;
          for (var i = list.length - 1, it; i >= 0; i--) {
            it = list[i];
            if (it.value.value === 'use strict') {
              list.splice(i, 1);
            }
          }
        }

      }
    }
  };
};