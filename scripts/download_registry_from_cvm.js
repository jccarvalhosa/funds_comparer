const axios = require('axios').default,
      mysql = require('../model/mysql').pool,
      encoding = require('encoding'),
      detectCharacterEncoding = require('detect-character-encoding');

const MAX_ROWS_PER_INSERT_STATEMENT = 1000;

let totalPendingQueries = 0;
let rowsAffected = 0;

/**
 *  @param {PoolConnection} connection
 *  @param {AxiosResponse} response
 */
function saveRegistryDataOnDatabase(connection, response) {
    let sql = '';
    let insert = '';
    let totalRowsOnStatement = 0;

    const charsetMatch = detectCharacterEncoding(response.data);
    const lines = encoding
        .convert(response.data, 'UTF-8', charsetMatch['encoding'], true)
        .toString('utf8')
        .trim()
        .replace(/'/g, '\\\'')
        .split('\n');

    console.log("Response lines (without header): " + (lines.length - 1));

    for (let i = 0; i < lines.length; i++) {
        const data = lines[i].trim().split(';');
        if (insert === '') {
            insert += 'REPLACE INTO FI_CAD(';
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
                    if (--totalPendingQueries === 0) {
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

/**
 * @param {Date} date
 * @param {Number} maxAttempts
 */
function tryFetchRegistryData(date, maxAttempts) {
    date.setDate(date.getDate() - 1);
    const dateString = date.toISOString();
    const url = "http://dados.cvm.gov.br/dados/FI/CAD/DADOS/inf_cadastral_fi_"
        + dateString.substr(0, dateString.indexOf('T')).replace(/-/g, '')
        + '.csv';
    axios.get(url, { timeout: 1000, responseType: 'arraybuffer' })
        .then(function(response) {
            mysql.getConnection(function(error, connection) {
                if (error) {
                    throw error;
                }
                saveRegistryDataOnDatabase(connection, response);
            });
        })
        .catch(function(error) {
            if (error.response && error.response.status !== 404) {
                throw error;
            }
            if (maxAttempts > 1) {
                return tryFetchRegistryData(date, maxAttempts - 1);
            }
        });
}

tryFetchRegistryData(new Date(), 5);
