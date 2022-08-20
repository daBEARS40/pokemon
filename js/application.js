define(["jquery", "knockout", "komapping"], ($, ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.pokemonList = ko.observableArray([]);
    }

    async startApplication() {
      await GetPokemonList.call(this);
      BindUIControls.call(this);
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

  function BindUIControls() {
    $("#pokemonSearch").on("keyup", TrimSearchResults);
  }

  function TrimSearchResults() {
    let currentSearch = $("#pokemonSearch").val();
    let i = Pokemon.pokemonList().length - 1;
    while (i >= 0) {
      let match = Pokemon.pokemonList()[i].name().match(currentSearch);
      if (!match) {
        Pokemon.pokemonList.remove(Pokemon.pokemonList()[i]);
        Pokemon.pokemonList.valueHasMutated();
      }
      i--;
    }
  }

  return Application;
});
