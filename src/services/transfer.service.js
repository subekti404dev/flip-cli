const { createHTTP } = require('../helpers/http.helper');
const chalk = require("chalk");
const os = require("os");
const path = require("path");
const configPath = path.join(os.homedir(), ".flip.json");
const formUrlEncodeHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
const qs = require('qs');
const inquirer = require("inquirer");

const inquiry = async (bank, account_number) => {
   try {
      const cfg = require(configPath);
      const http = createHTTP(cfg.token);
      const { data } = await http.get('/v2/accounts/inquiry-account-number', { params: { bank, account_number } });
      if (data.id === -1) throw new Error("Invalid account number");
      return data
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

const isBreak = async () => {
   try {
      const cfg = require(configPath);
      const http = createHTTP(cfg.token);
      const { data } = await http.get('/v1/site/is-istirahat');
      if (data.istirahat) throw new Error("We are in break. Please try again later");
      return data.istirahat
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}


const validateAndTransfer = async (
   account_number,
   beneficiary_bank,
   beneficiary_name,
   amount,
   remark
) => {
   try {
      const cfg = require(configPath);
      const http = createHTTP(cfg.token);
      const payloadData = {
         account_number,
         beneficiary_bank,
         beneficiary_name,
         amount,
         service_type: 7,
         remark,
         fee: 0
      }
      const payload = qs.stringify(payloadData);
      const { data } = await http.post('/v2/transactions/validate', payload, { headers: formUrlEncodeHeaders });
      if (!data.validation_result) throw new Error(data?.errors?.[0]?.message);
      return transfer(payloadData);
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

const transfer = async (params) => {
   try {
      const quest1 = [
         {
            name: "pin",
            type: "password",
            message: "PIN: ",
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please imput your PIN";
               }
            },
         },
      ]
      const { pin } = await inquirer.prompt(quest1);
      params.password = pin;
      const cfg = require(configPath);
      const http = createHTTP(cfg.token);
      
      const { data } = await http.post('/v2/e-money/me/create-transfer', qs.stringify(params), { headers: formUrlEncodeHeaders });
      console.log(chalk.green(data.status));
      return data;
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}


module.exports = { inquiry, isBreak, validateAndTransfer };