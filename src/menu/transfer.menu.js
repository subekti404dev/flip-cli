const chalk = require("chalk");
const clear = require("clear");
const { printTitle } = require("../helpers/title.helper");
const inquirer = require("inquirer");
const { inquiry, isBreak, validateAndTransfer } = require("../services/transfer.service");
const { banks } = require("../constants/bank.constant");

const transferMenu = async () => {
   try {
      clear();
      printTitle();

      const quest1 = [
         {
            name: "bank",
            type: "list",
            message: "Choose Bank :",
            choices: banks.map(bank => bank.id + ". " + bank.name),
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please choose bank";
               }
            },
         },
         {
            name: "account_number",
            type: "input",
            message: "Account Number : ",
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please imput your account number";
               }
            },
         },
      ];
      const ans1 = await inquirer.prompt(quest1);
      const bankID = parseInt(ans1.bank.split(". ")[0]);
      const bankCode = banks.find(bank => bank.id === bankID)?.value;
      const accountNumber = ans1.account_number;
      const data = await inquiry(bankCode, accountNumber);
      console.log(chalk.green("Name       : " + data.name));
      const quest2 = [
         {
            name: "amount",
            type: "input",
            message: "Amount : ",
            validate: function (value) {
               if (value.length) {
                  if (parseInt(value) < 10000) return "Amount must be greater than 10000";
                  return true;
               } else {
                  return "Please imput your amount";
               }
            },
         },
         {
            name: "remark",
            type: "input",
            message: "Remark : ",
            default: data.name,
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please imput remark";
               }
            },
         },
      ]
      ans2 = await inquirer.prompt(quest2);
      const amount = parseInt(ans2.amount || "0");
      await isBreak();
      await validateAndTransfer(accountNumber, bankCode, data.name, amount, ans2.remark);

   } catch (error) {
      process.exit(1);
   }
};

module.exports = { transferMenu };