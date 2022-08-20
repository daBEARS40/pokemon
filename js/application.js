define(["jquery", "knockout", "komapping"], ($, ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.pokemonList = ko.observableArray([]);
    }

    async startApplication() {
      await GetPokemonList.call(this);
      ko.applyBindings(this);
    }
  }

  function GetPokemonList() {
    return new Promise((resolve) => {
      fetch(`${this.baseServiceUrl}pokemon?limit=100000&offset=0`)
        .then((response) => response.json())
        .then((data) => {
          $.each(data.results, (_i, v) => {
            let obj = { name: v.name, url: v.url };
            this.pokemonList.push(ko.mapping.fromJS(obj));
          });
          resolve();
        });
    });
  }

  return Application;
});
