define(["jquery", "knockout", "komapping"], ($, ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.pokemonList = [];
      this.pokemonOptions = ko.observableArray([]);
    }

    async startApplication() {
      await GetPokemonList.call(this);
      BindUIControls.call(this);
      ko.applyBindings(this);
    }
  }

  function BindUIControls() {
    $("#pokemonSearch").on("change", TrimSearchResults.call(this));
  }

  function GetPokemonList() {
    return new Promise((resolve) => {
      fetch(`${this.baseServiceUrl}pokemon?limit=100000&offset=0`)
        .then((response) => response.json())
        .then((data) => {
          this.pokemonList = data.results;
          $.each(data.results, (_i, v) => {
            let obj = { name: null };
            obj.name = v.name;
            this.pokemonOptions.push(ko.mapping.fromJS(obj));
          });
          if (this.pokemonOptions().length === this.pokemonList.length) {
            resolve();
          }
        });
    });
  }

  function TrimSearchResults() {}

  return Application;
});
