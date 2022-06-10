import { render, screen, userEvent, waitFor } from 'test-utils'
import FavoritePokemon from '.'

describe('<FavoritePokemon/>', () => {
  test('allows selection from a variety of Pokemon', async () => {
    // The initial configuration should have a select with three options,
    // the first of which is selected.  Its name should appear in the
    // heading.
    const options = ['Pikachu', 'Squirtle', 'Mr. Mime']
    render(<FavoritePokemon options={options} />)
    expect(screen.getByRole('heading')).toHaveTextContent(options[0])
    expect(screen.getByLabelText(/favorite pokemon/i)).toHaveTextContent(
      options[0]
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    // We can fire an event simulating a change in the select...
    let favorite = 'Squirtle'
    await userEvent.selectOptions(screen.getByLabelText(/favorite pokemon/i), [
      favorite,
    ])
    expect(screen.getByRole('heading')).toHaveTextContent(favorite)
    expect(screen.getByLabelText(/favorite pokemon/i)).toHaveTextContent(
      favorite
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    // And we can change it back...
    favorite = 'Pikachu'
    await userEvent.selectOptions(screen.getByLabelText(/favorite pokemon/i), [
      favorite,
    ])
    expect(screen.getByRole('heading')).toHaveTextContent(favorite)
    expect(screen.getByLabelText(/favorite pokemon/i)).toHaveTextContent(
      favorite
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    // And simulate error conditions, however unlikely...
    favorite = 'Mr. Mime'
    await userEvent.selectOptions(screen.getByLabelText(/favorite pokemon/i), [
      favorite,
    ])
    expect(screen.getByRole('heading')).toHaveTextContent(favorite)
    expect(screen.getByLabelText(/favorite pokemon/i)).toHaveTextContent(
      favorite
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
