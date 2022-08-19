define(["/plugins/knockout.js", "/plugins/komap/komapping.js"], (ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.pokemonList = [];
    }

    startApplication() {
      GetPokemonList.call(this);
      BindUIControls.call(this);
    }
  }

  function BindUIControls() {
    // $("#pokemonSearch").on("change", TrimSearchResults.call(this));
  }

  function GetPokemonList() {
    fetch(`${this.baseServiceUrl}pokemon?limit=100000&offset=0`)
      .then((response) => response.json())
      .then((data) => {
        this.pokemonList = data.results;
      });
  }

  return Application;
});
