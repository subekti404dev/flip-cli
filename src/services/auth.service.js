const { createHTTP } = require('../helpers/http.helper');
const qs = require('qs');
const formUrlEncodeHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' };
const inquirer = require("inquirer");
const chalk = require("chalk");
const os = require("os");
const path = require("path");
const fs = require("fs");
const configPath = path.join(os.homedir(), ".flip.json");

const login = async () => {
   try {
      const questions = [
         {
            name: "email",
            type: "input",
            message: "Email:",
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please imput your email";
               }
            },
         },
         {
            name: "password",
            type: "password",
            message: "Password:",
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please input your password";
               }
            },
         },
      ];

      const { email, password } = await inquirer.prompt(questions);

      const http = createHTTP();
      const payload = qs.stringify({
         via: 'email',
         platform: 'android',
         version: '179',
         email,
         password,
         otp: 'null',
         device_id: 'null'
      });
      const { data } = await http.post('/v2/user/login', payload, { headers: formUrlEncodeHeaders });

      return sendOTP(data.token);
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

const sendOTP = async (token) => {
   try {
      const http = createHTTP(token);
      const payload1 = qs.stringify({ channel: 'via-sms-by-service' });
      await http.post('/v2/user/send-otp', payload1, { headers: formUrlEncodeHeaders });

      const questions = [
         {
            name: "verification_code",
            type: "input",
            message: "OTP:",
            validate: function (value) {
               if (value.length) {
                  return true;
               } else {
                  return "Please imput your OTP";
               }
            },
         },
      ];

      const { verification_code } = await inquirer.prompt(questions);
      const payload2 = qs.stringify({
         verification_code,
         device_model: 'Flip CLI',
         os_version: 'Android 11',
      });

      const { data } = await http.post('/v2/user-device/verify', payload2, { headers: formUrlEncodeHeaders });

      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));

      return data;
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

const refreshToken = async () => {
   try {
      const cfg = require(configPath);

      const http = createHTTP(cfg.token);
      const payload = qs.stringify({
         platform: 'android',
         version: '179',
         device_id: cfg.device_id
      });
      const { data } = await http.put('/v2/user/generate-new-token', payload, { headers: formUrlEncodeHeaders });

      fs.writeFileSync(configPath, JSON.stringify(data, null, 2));

      return data;
   } catch (error) {
      const errMsg = error?.response?.data?.message || error?.response?.data?.errors?.[0]?.message || error?.response?.data || error?.message || error;
      console.log(chalk.red(errMsg));
      throw new Error(errMsg);
   }
}

module.exports = { login, refreshToken };