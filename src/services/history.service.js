const { createHTTP } = require('../helpers/http.helper');
const chalk = require("chalk");
const os = require("os");
const path = require("path");
const configPath = path.join(os.homedir(), ".flip.json");

const getHistory = async (page = 1, pagination = 30) => {
   try {
      const cfg = require(configPath);
      const http = createHTTP(cfg.token);
      const { data } = await http.get('/v2/transactions', {
         params: {
            include_international_transfer: true,
            page, pagination
         }
      });
      const obj = (data || {});
      const list = [];
      for (const key in obj) {
         list.push(obj[key]);
      }
      return list;
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

module.exports = { getHistory };