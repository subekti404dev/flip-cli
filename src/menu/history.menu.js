const clear = require("clear");
const { printTitle } = require("../helpers/title.helper");
const inquirer = require("inquirer");
const { getHistory } = require("../services/history.service");

const historyMenu = async () => {
   try {
      clear();
      printTitle();
      const histories = (await getHistory()).filter(h => h.beneficiary_bank);
      const quest1 = [
         {
            name: "history",
            type: "list",
            choices: histories.map(x => `[${x.beneficiary_bank} - ${x.beneficiary_name}] [${x.amount}] [${x.status}]`),
         },
        
      ];
      await inquirer.prompt(quest1);
      process.exit(1);
      
   } catch (error) {
      process.exit(1);
   }
};

module.exports = { historyMenu };