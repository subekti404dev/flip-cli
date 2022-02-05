const chalk = require("chalk");
const figlet = require("figlet");

const printTitle = () => {
   console.log(
      chalk.yellow(figlet.textSync("Flip-CLI", { horizontalLayout: "full" }))
   );
}

module.exports = { printTitle };