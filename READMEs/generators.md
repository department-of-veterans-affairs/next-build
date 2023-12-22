Developers contributing to this project can use [plop](https://plopjs.com/) to generate new files in a consistent manner.

# What is Plop?

> Plop is what I like to call a "micro-generator framework." Now, I call it that because it is a small tool that gives you a simple way to generate code or any other type of flat text files in a consistent way. You see, we all create structures and patterns in our code (routes, controllers, components, helpers, etc). These patterns change and improve over time so when you need to create a NEW insert-name-of-pattern-here, it's not always easy to locate the files in your codebase that represent the current "best practice." That's where plop saves you. With plop, you have your "best practice" method of creating any given pattern in CODE. Code that can easily be run from the terminal by typing plop. Not only does this save you from hunting around in your codebase for the right files to copy, but it also turns "the right way" into "the easiest way" to make new files.

> If you boil plop down to its core, it is basically glue code between inquirer prompts and handlebar templates.

Run `yarn plop` to view a list of generators available to this project.

See `plopfile.js` for specifics of each generator.

Templates for existing generators can be found inside of `generator-templates`.

Helpful documentation:

- [Plop docs](https://plopjs.com/documentation/)
- [Inquirer options](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md#question)
- [Handlebars](https://github.com/handlebars-lang/handlebars.js?tab=readme-ov-file#usage)
