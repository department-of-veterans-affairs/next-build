# Contributing Guidelines

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

### Reporting Bugs

- Before creating a bug report, please check the existing issues to avoid duplicates
- When creating a bug report, include:
  - A clear and descriptive title
  - Detailed steps to reproduce the issue
  - Expected behavior vs actual behavior
  - Screenshots if applicable
  - Your environment (OS, browser, version etc.)

### Suggesting Enhancements

- Use the issue tracker to suggest enhancements
- Clearly describe the feature and its use case
- Explain why this enhancement would be useful

### Pull Requests

1. Clone the repository
2. Create a new branch from `main` (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests if applicable
5. Commit your changes with a clear message (bonus points for [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)):

   ```sh
   git commit -m 'Add: new feature X'
   git commit -m 'Fix: issue with Y'
   git commit -m 'Update: improve Z functionality'
   ```

6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request against the `main` branch

#### Pull Request Guidelines

- All PRs must target the `main` branch
- Keep PRs small and focused on a single feature or fix
  - If you find yourself changing multiple things, consider breaking it into separate PRs
  - A good PR should be small enough to review in 10-15 minutes
- Follow the existing code style and conventions
- Include tests if adding new functionality
- Update documentation as needed
- Provide a clear description in your PR that explains:
  - What changes you made
  - Why you made these changes
  - How to test the changes
  - Any related issues (use "Fixes #123" or "Relates to #123")
- Add screenshots or GIFs if you made UI changes
- Make sure all tests pass before requesting review
- Respond to review comments promptly

## Development Setup

1. Clone the repository
2. Install dependencies with `yarn install`
3. Create a new branch for your changes
4. Make your changes
5. Test your changes locally
6. Submit a pull request

## Style Guidelines

- Follow existing code formatting
- Write clear, descriptive commit messages
- Comment your code when necessary
- Keep functions focused and modular

## Additional Resources

- [Project Documentation](README.md)
- [Issue Templates](.github/ISSUE_TEMPLATE)
- [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md)

## Questions?

If you have questions, feel free to open an issue or contact the maintainers.
