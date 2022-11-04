requirejs.config({
  config: {
    text: {
      useXhr: function (url, protocol, hostname, port) {
        return true;
      },
    },
  },
  baseUrl: "http://127.0.0.1:5500/",
  paths: {
    jquery: "plugins/jquery",
    knockout: "plugins/knockout",
    komapping: "plugins/komapping",
    text: "plugins/text",
  },
});
