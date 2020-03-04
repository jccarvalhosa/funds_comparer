
use mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

CREATE DATABASE IF NOT EXISTS cvm CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

CREATE USER IF NOT EXISTS 'cvm'@'localhost' IDENTIFIED BY 'cvm123';
ALTER USER 'cvm'@'localhost' IDENTIFIED WITH mysql_native_password BY 'cvm123';

GRANT ALL PRIVILEGES ON cvm.* TO 'cvm'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `cvm`.`FI_CAD` (
  `CNPJ_FUNDO` VARCHAR(20) NOT NULL,
  `DENOM_SOCIAL` VARCHAR(100),
  `DT_REG` DATE,
  `DT_CONST` DATE,
  `DT_CANCEL` DATE,
  `SIT` VARCHAR(40),
  `DT_INI_SIT` DATE,
  `DT_INI_ATIV` DATE,
  `DT_INI_EXERC` DATE,
  `DT_FIM_EXERC` DATE,
  `CLASSE` VARCHAR(100),
  `DT_INI_CLASSE` DATE,
  `RENTAB_FUNDO` VARCHAR(100),
  `CONDOM` VARCHAR(15),
  `FUNDO_COTAS` CHAR(1),
  `FUNDO_EXCLUSIVO` CHAR(1),
  `TRIB_LPRAZO` CHAR(1),
  `INVEST_QUALIF` CHAR(1),
  `TAXA_PERFM` FLOAT,
  `INF_TAXA_PERFM` VARCHAR(400),
  `TAXA_ADM` FLOAT ,
  `INF_TAXA_ADM` VARCHAR(400),
  `VL_PATRIM_LIQ` DECIMAL(18, 2),
  `DT_PATRIM_LIQ` DATE,
  `DIRETOR` VARCHAR(100),
  `CNPJ_ADMIN` VARCHAR(20),
  `ADMIN` VARCHAR(100),
  `PF_PJ_GESTOR` CHAR(2),
  `CPF_CNPJ_GESTOR` VARCHAR(20),
  `GESTOR` VARCHAR(100),
  `CNPJ_AUDITOR` VARCHAR(20),
  `AUDITOR` VARCHAR(100),
  `CNPJ_CUSTODIANTE` VARCHAR(20),
  `CUSTODIANTE` VARCHAR(100),
  `CNPJ_CONTROLADOR` VARCHAR(20),
  `CONTROLADOR` VARCHAR(100),
  PRIMARY KEY (`CNPJ_FUNDO`) )
ENGINE = InnoDB;

 CREATE TABLE IF NOT EXISTS `cvm`.`FI_DOC_INF_DIARIO` (
   `CNPJ_FUNDO` VARCHAR(20) NOT NULL ,
   `DT_COMPTC` DATE NOT NULL,
   `VL_TOTAL` DECIMAL(18, 2) NOT NULL,
   `VL_QUOTA` DECIMAL(28, 12) NOT NULL,
   `VL_PATRIM_LIQ` DECIMAL(18, 2),
   `CAPTC_DIA` DECIMAL(18, 2),
   `RESG_DIA` DECIMAL(18, 2),
   `NR_COTST` INTEGER UNSIGNED,
   PRIMARY KEY (`CNPJ_FUNDO`, `DT_COMPTC`) )
 ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cvm`.`FIE_CAD` (
  `TP_FUNDO` VARCHAR(15),
  `CNPJ_FUNDO` VARCHAR(20) NOT NULL,
  `DENOM_SOCIAL` VARCHAR(100),
  `DT_REG` DATE,
  `DT_CONST` DATE,
  `DT_CANCEL` DATE,
  `SIT` VARCHAR(40),
  `DT_INI_SIT` DATE,
  `DT_INI_ATIV` DATE,
  `DT_INI_EXERC` DATE,
  `DT_FIM_EXERC` DATE,
  `CNPJ_ADMIN` VARCHAR(20),
  `ADMIN` VARCHAR(100),
  `PF_PJ_GESTOR` CHAR(2),
  `CPF_CNPJ_GESTOR` VARCHAR(20),
  `GESTOR` VARCHAR(100),
  `CNPJ_AUDITOR` VARCHAR(20),
  `AUDITOR` VARCHAR(100),
  PRIMARY KEY (`CNPJ_FUNDO`) )
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cvm`.`FIE_MEDIDAS` (
  `TP_FUNDO` VARCHAR(15),
  `CNPJ_FUNDO` VARCHAR(20) NOT NULL,
  `DENOM_SOCIAL` VARCHAR(100),
  `DT_COMPTC` DATE NOT NULL,
  `VL_PATRIM_LIQ` DECIMAL(18, 2),
  `NR_COTST` INTEGER UNSIGNED,
  PRIMARY KEY (`CNPJ_FUNDO`, `DT_COMPTC`) )
ENGINE = InnoDB;




