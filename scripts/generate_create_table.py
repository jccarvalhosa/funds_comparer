import sys

fileName = sys.argv[1]
tableName = sys.argv[2]

query = 'CREATE TABLE IF NOT EXISTS `cvm`.`{}` (\n'.format(tableName)
separator = '-----------------------'

def parseKeyValue(line):
    return list(map(lambda x: x.strip(), line.split(':')))

with open(fileName, 'r', encoding='iso-8859-1') as f:
    while True:
        line = f.readline()
        if not line:
            break
        if line.strip() != separator:
            print('Unexpected line: ' + line)
            break

        line = f.readline()
        columnName = parseKeyValue(line)[1]
        dataType = ''
        length = precision = scale = 0
        f.readline()
        while True:
            line = f.readline()
            if line.isspace():
                break
            key, value = parseKeyValue(line)
            if key == 'Tipo Dados':
                dataType = value
            elif key == 'Tamanho':
                length = int(value)
            elif key == 'Precisão':
                precision = int(value)
            elif key == 'Scale':
                try:
                    scale = int(value)
                except ValueError:
                    scale = 0

        query += '  `{}` '.format(columnName)
        if length == 1:
           dataType = 'char'

        if dataType == 'char' or dataType == 'varchar':
            query += '{}({})'.format(dataType.upper(), length)
        elif dataType == 'date':
            query += 'DATE'
        elif dataType == 'numeric' or dataType == 'decimal':
            query += 'DECIMAL({}, {})'.format(precision + 1, scale)
        elif dataType == 'float':
            query += 'FLOAT'
        elif dataType == 'real':
            query += 'DOUBLE'
        else:
            raise Exception(dataType)

        if columnName == 'CNPJ_FUNDO' or columnName == 'DT_COMPTC':
            query += ' NOT NULL'

        query += ',\n'

query += '  PRIMARY KEY (`CNPJ_FUNDO`, `DT_COMPTC`) )\n'
query += 'ENGINE = InnoDB;'
print(query)
