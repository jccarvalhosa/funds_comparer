#!/usr/bin/env bash

mysql -uroot < create_tables.sql
npm install
node download_registry_from_cvm.js
node download_daily_info_from_cvm.js
