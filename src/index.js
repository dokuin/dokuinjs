import fs from 'fs';
import chalk from 'chalk';
import cliInit from './init';
import cliRun from './run';
import cliConvert from './convert';
import cliGenerate from './endpoints';
import { start } from './start';
import { DeleteEndpoint, UpdateEndpoint } from './mutation';

export default class Cli {
  static start(){
    return start()
  }

  static init() {
    return cliInit();
  }

  static run() {
    return cliRun();
  }

  static convert() {
    return cliConvert();
  }

  static create() {
    return cliGenerate();
  }

  static add() {
    return cliGenerate(true);
  }

  static rawList(){
    if(fs.existsSync(`${process.cwd()}/dokuin.endpoints.json`)){
      const list = fs.readFileSync(`${process.cwd()}/dokuin.endpoints.json`, 'utf-8')
      return JSON.parse(list)
    }else{
      console.clear()
      console.log(chalk.red(`\nPlease make the configuration first: \n`))
      Cli.init()
    }
  }

  static list(autoclose = true){
    const list = Cli.rawList()
    const tableList = []   
    list.forEach(list => {
      let row = {
        id: list.id,
        method: list.method,
        path: list.path,
        description: list.description
      }
      tableList.push(row)
    })
    console.log(chalk.bold.cyan('\nYour endpoint list: \n'))
    console.table(tableList)
    
    if(autoclose){
      process.exit(0)
    }
  }

  static update(){
    return UpdateEndpoint()
  }

  static delete(){
    return DeleteEndpoint()
  }
}
