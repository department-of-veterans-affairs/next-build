import React from 'react'

/**
 * A helper function to condense and simplify Pokemon names.
 *
 * For the sake of consistency, we lowercase the names and
 * then remove any non-alphanumeric characters.
 *
 * @param {String} name The name of the Pokemon.
 * @returns {String} An alphanumeric string version of the name.
 */
function getPokemonKey(name: string): string {
  return name.toLowerCase().replace(/\W/g, '')
}

/**
 * A React component allowing you to choose a favorite Pokemon from a list.
 *
 * (Gen 1 only, because I'm old school.)
 *
 * The `props` parameter should be structured as follows:
 * {
 *   options: [
 *     'Pikachu',
 *     'Squirtle',
 *     'Mr. Mime',
 *     ...
 *   ]
 * }
 *
 * @param {Object} props An object structured as above.
 * @returns {Component} A component allowing you to select a Pokemon from a dropdown.
 */
function FavoritePokemon(props): JSX.Element {
  // Create a map from each Pokemon's "key" name to its full, proper name, for
  // display purposes.
  const pokemonMap = new Map()
  props.options.forEach((name) => {
    pokemonMap.set(getPokemonKey(name), name)
  })
  const defaultValue = getPokemonKey(props.options[0])
  // React.useState() is used to set a sort of persistent variable that will
  // remain between function calls.
  // In this case, we can use the `favorite` variable to access the current
  // favorite Pokemon, and the `setFavorite()` function to update the value.
  const [favorite, setFavorite] = React.useState(defaultValue)
  // Mr. Mime is nightmare fuel.
  const isNotMrMime = favorite !== getPokemonKey('Mr. Mime')
  return (
    <div>
      {/* Display the favorite Pokemon name prominently. */}
      <h1>{pokemonMap.get(favorite)}</h1>
      {/* Prefer labels (and avoid `id`s, `class`es, etc) for querying for 
      inputs.  This is to promote accessibility, among other things. */}
      <label htmlFor="favorite-pokemon">Favorite Pokemon</label>
      {/* 
      This <select> element will populate with a provided list of Pokemon.
      When the selection is changed, it should call `setFavorite()` and update
      the `favorite` variable, which should then update the displayed Pokemon
      name in the <h1> heading above.
      */}
      <select
        onChange={(event) => setFavorite(event.target.value)}
        id="favorite-pokemon"
        name="favorite-pokemon"
      >
        {/* 
        Create an option for each Pokemon.  The `key` attribute should be
        unique and deterministic for each item; this is to help React to keep
        track of these items even if they're rearranged via drag-n-drop or some
        other process.
        */}
        {props.options.map((pokemon) => (
          <option key={getPokemonKey(pokemon)} value={getPokemonKey(pokemon)}>
            {pokemon}
          </option>
        ))}
      </select>
      {/* 
      If Mr. Mime is selected, call the user's attention to this situation
      so that they may immediately take action.  They should also be thankful
      that we did not alert the local constabulary.
      */}
      {isNotMrMime ? null : <div role="alert">Seriously?</div>}
    </div>
  )
}

export default FavoritePokemon
