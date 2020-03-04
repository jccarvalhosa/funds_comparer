const axios = require('axios').default,
      mysql = require('../model/mysql').pool;

const MAX_ROWS_PER_INSERT_STATEMENT = 1000;
const MAX_SIMULTANEOUS_REQUESTS = 2;
const INITIAL_FETCH_COMPETENCY = new Date('2019-03');
const FINAL_FETCH_COMPETENCY = new Date('2020-03');

let totalPendingQueries = 0;
let rowsAffected = 0;
let totalPendingRequests = 0;

/**
 *  @param {PoolConnection} connection
 *  @param {AxiosResponse} response
 */
function saveDailyInfoOnDatabase(connection, response) {
    let sql = '';
    let insert = '';
    let totalRowsOnStatement = 0;

    const lines = response.data
        .trim()
        .split('\n');

    console.log("Response lines (without header): " + (lines.length - 1));

    for (let i = 0; i < lines.length; i++) {
        const data = lines[i].trim().split(';');
        if (insert === '') {
            insert += 'REPLACE INTO FI_DOC_INF_DIARIO(';
            insert += data.join(',');
            insert += ') VALUES ';
        } else {
            if (totalRowsOnStatement === 0) {
                sql = insert;
            } else {
                sql += ',';
            }
            totalRowsOnStatement++;
            sql += '(\'';
            sql += data.join('\',\'').replace(/''/g, 'NULL');
            sql += '\')';
            let isLastStatement = i === lines.length - 1;
            if (isLastStatement || (totalRowsOnStatement === MAX_ROWS_PER_INSERT_STATEMENT)) {
                totalRowsOnStatement = 0;
                sql += ';';
                totalPendingQueries++;
                connection.query(sql, function (error, rows) {
                    if (rows) {
                        rowsAffected += rows.affectedRows;
                    }
                    if (--totalPendingQueries === 0 && totalPendingRequests === 0) {
                        console.log( "Rows affected: " + rowsAffected);
                        mysql.end();
                    }
                    if (error) {
                        throw error;
                    }
                });
            }
        }
    }
}

let nextRequestIndex = 0;
let urls = [];

/** @param {PoolConnection} connection */
function performHttpRequest(connection) {
    let url = urls[nextRequestIndex];
    axios.get(url, {timeout: 15000})
        .then(function (response) {
            console.log(url);
            saveDailyInfoOnDatabase(connection, response);
        })
        .catch(function (error) {
            if (error.response && error.response.status !== 404) {
                throw error;
            }
        })
        .finally(function () {
            if (--totalPendingRequests === 0 && totalPendingQueries === 0) {
                console.log("Rows affected: " + rowsAffected);
                mysql.end();
            }
            if (nextRequestIndex < urls.length) {
                nextRequestIndex++;
                performHttpRequest(connection);
            }
        });
}

mysql.getConnection(function(error, connection) {
    if (error) {
        throw error;
    }

    for (let date = INITIAL_FETCH_COMPETENCY; FINAL_FETCH_COMPETENCY - date >= 0; date.setUTCMonth(date.getUTCMonth()+1)) {
        let dateString = date.toISOString();
        urls.push("http://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi_"
            + dateString.substr(0, dateString.lastIndexOf('-')).replace('-', '')
            + '.csv');
    }

    totalPendingRequests = urls.length;
    for (nextRequestIndex = 0; nextRequestIndex < Math.min(urls.length, MAX_SIMULTANEOUS_REQUESTS); nextRequestIndex++) {
        performHttpRequest(connection);
    }
});
