define(["jquery", "knockout", "komapping"], ($, ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.allPokemon = [];
      this.pokemonSearchList = ko.observableArray([]);
      this.selectedPkmn = ko.observable();
      this.spriteUrl = ko.observable("");
      this.currentSearch = "";
      this.searchLength = 0;
    }

    displayPokemon(item) {
      let pkmn = ko.mapping.toJS(item);
      fetch(`${pkmn.url}`)
        .then((response) => response.json())
        .then((data) => {
          Pokemon.selectedPkmn(ko.mapping.fromJS(data));
          Pokemon.spriteUrl(data.sprites.front_default);
        });
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
          this.allPokemon = data.results;
          $.each(data.results, (_i, v) => {
            this.pokemonSearchList.push(ko.mapping.fromJS(v));
          });
          resolve();
        });
    });
  }

  function BindUIControls() {
    $("#pokemonSearch").on("keyup", ManageSearchResults.bind(this));
  }

  function ManageSearchResults() {
    this.currentSearch = $("#pokemonSearch").val();
    if (!this.currentSearch) {
      if (this.pokemonSearchList.length !== this.allPokemon.length) {
        this.pokemonSearchList.removeAll();
        for (const mon of this.allPokemon) {
          this.pokemonSearchList.push(ko.mapping.fromJS(mon));
        }
        this.searchLength = 0;
      }
      return;
    }
    if (this.currentSearch.length > this.searchLength) {
      TrimSearchResults.call(this);
    } else if (this.currentSearch.length < this.searchLength) {
      GrowSearchResults.call(this);
    } else {
      return;
    }
  }

  function TrimSearchResults() {
    let i = this.pokemonSearchList().length - 1;
    while (i >= 0) {
      let match = this.pokemonSearchList()
        [i].name()
        .match(this.currentSearch.toLowerCase());
      if (!match) {
        this.pokemonSearchList.remove(this.pokemonSearchList()[i]);
        this.pokemonSearchList.valueHasMutated();
      }
      i--;
    }
    this.searchLength = this.currentSearch.length;
  }

  function GrowSearchResults() {
    this.pokemonSearchList.removeAll();
    for (const mon of this.allPokemon) {
      let match = mon.name.match(this.currentSearch.toLowerCase());
      if (match) {
        this.pokemonSearchList.push(ko.mapping.fromJS(mon));
      }
    }
    this.pokemonSearchList.valueHasMutated();
    this.searchLength = this.currentSearch.length;
  }

  return Application;
});
