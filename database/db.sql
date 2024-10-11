-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`sensors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`sensors` (
  `location` VARCHAR(45) NOT NULL,
  `time` DATETIME NULL,
  `temperature` INT NULL,
  `humidity` INT NULL,
  `requestOK` TINYINT NULL,
  PRIMARY KEY (`location`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`log`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`log` (
  `userID` INT NOT NULL,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `logTime` DATETIME NULL,
  PRIMARY KEY (`userID`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
