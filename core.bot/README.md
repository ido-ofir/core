# core.bot

A dynamic node task runner.

### Installation
Install globaly with npm.
```sh
npm install -g core.bot
```

### Usage

Test your installation:
```sh
core.bot
```
You should drop into a <a href="https://nodejs.org/api/repl.html#repl_repl">repl</a> which means the installation was successful.

the bot does not know how to do anything yet,
so we need to start giving it commands.

first create a folder for your commands, anywhere you like:
```sh
core.bot make folder commands
```
then a file for your command. the name of the file will be the name of the command:
```sh
core.bot make file commands/test.js with "console.log('ok');"
```
```sh
core.bot use commands
```

