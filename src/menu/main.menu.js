const chalk = require("chalk");
const clear = require("clear");
const inquirer = require("inquirer");
const { getUser } = require("../services/user.service");
const { transferMenu } = require("./transfer.menu")
const { walletMenu } = require("./wallet.menu")
const { printTitle } = require("../helpers/title.helper");


const mainMenu = async () => {
   clear();
   printTitle();
   const { account_name, balance } = await getUser();

   console.log(chalk.green("Name       : " + account_name));
   console.log(chalk.green("Balance    : " + balance));
   console.log(chalk.yellow("----------------------------------------"));
   const questions = [
      {
         name: "menu",
         type: "list",
         message: "Choose Menu :",
         choices: [
            "1. Transfer Bank",
            "2. Topup e-wallet",
            "3. History Transaction",
            "0. Exit",
         ],
         validate: function (value) {
            if (value.length) {
               return true;
            } else {
               return "Please choose the type";
            }
         },
      },
   ];
   const ans = await inquirer.prompt(questions);
   const numOfMenu = ans.menu.split(". ")[0];
   switch (numOfMenu) {
      case "1":
         transferMenu();
         break;

      case "2":
         walletMenu();
         break;

      case "3":

         break;

      default:
         clear();
         break;
   }

};

module.exports = { mainMenu };