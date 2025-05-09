-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema cefform
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `cefform` ;

-- -----------------------------------------------------
-- Schema cefform
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cefform` DEFAULT CHARACTER SET utf8mb3 ;
USE `cefform` ;

-- -----------------------------------------------------
-- Table `cefform`.`answerer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cefform`.`answerer` (
  `idanswerer` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idanswerer`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cefform`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cefform`.`user` (
  `iduser` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(10) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(40) NULL DEFAULT NULL,
  `last_name` VARCHAR(60) NULL DEFAULT NULL,
  `email` VARCHAR(115) NULL DEFAULT NULL,
  `ceff` TINYINT NOT NULL DEFAULT -1,
  PRIMARY KEY (`iduser`),
  INDEX `UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cefform`.`form`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cefform`.`form` (
  `idform` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `description` VARCHAR(125) NOT NULL,
  `end_time` DATETIME NOT NULL,
  `anonym` TINYINT NOT NULL,
  `published` TINYINT NOT NULL DEFAULT '0',
  `user_iduser` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idform`),
  INDEX `fk_form_user_idx` (`user_iduser` ASC) VISIBLE,
  CONSTRAINT `fk_form_user`
    FOREIGN KEY (`user_iduser`)
    REFERENCES `cefform`.`user` (`iduser`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cefform`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cefform`.`question` (
  `idquestion` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(235) NOT NULL,
  `type` TINYINT NOT NULL,
  `page` INT NOT NULL DEFAULT '1',
  `form_idform` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idquestion`),
  INDEX `fk_question_form1_idx` (`form_idform` ASC) VISIBLE,
  CONSTRAINT `fk_question_form`
    FOREIGN KEY (`form_idform`)
    REFERENCES `cefform`.`form` (`idform`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `cefform`.`response`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cefform`.`response` (
  `idresponse` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(300) NOT NULL,
  `question_idquestion` INT UNSIGNED NOT NULL,
  `answerer_idanswerer` INT UNSIGNED NULL,
  PRIMARY KEY (`idresponse`),
  INDEX `fk_response_question1_idx` (`question_idquestion` ASC) VISIBLE,
  INDEX `fk_response_answerer1_idx` (`answerer_idanswerer` ASC) VISIBLE,
  CONSTRAINT `fk_response_answerer1`
    FOREIGN KEY (`answerer_idanswerer`)
    REFERENCES `cefform`.`answerer` (`idanswerer`),
  CONSTRAINT `fk_response_question`
    FOREIGN KEY (`question_idquestion`)
    REFERENCES `cefform`.`question` (`idquestion`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
