import cli from './index';
const fs = require('fs');
const endpoints = {}
const readline = require('./readline');
const chalk = require('chalk');
const boxen = require('boxen')
const warning = chalk.keyword('orange')
const ora = require('ora');
const { questionArray } = require('./endpointQuestion');

export default (add = false) => {
  const message = add ? 'Fill these to add new endpoint' : 'Fill these to create endpoints'
  console.log(chalk.bold.cyan(boxen('Dokuin endpoints configuration: ', { padding: 1 })))
  console.log(warning(message + '\n'))
  
  const listEndpoint = cli.rawList()
  endpoints.init = () => {
    let totalQuestion = questionArray.length
    let index = 0
    const data = {}
    endpoints.question = () => {
      readline.question(questionArray[index].question, (value) => {
        data.id = listEndpoint.length + 1
        if(questionArray[index].name === 'method' 
          || questionArray[index].name === 'url' 
          || questionArray[index].name === 'path'
          || questionArray[index].name === 'description'){
          data[questionArray[index].name] = value
          index++
        }else{
          if(questionArray[index].name !== 'next'){
            data[questionArray[index].name] = {}
            if(value === 'yes' || value === 'y'){
              console.clear()
              console.log(chalk.bold.cyan(`${questionArray[index].name} configuration:\n`))
              let totalNestedQuestion = 3
              let nestedIndex = 0
              let key = ''
              let nestedData = {}
              let values = ''
              endpoints.nestedQuestion = () => {
                readline.question(questionArray[index].nestedQuestion[nestedIndex].question, (text) => {
                  if(nestedIndex === 0){
                    key = text
                  }else if(nestedIndex === 1){
                    values = text
                  }

                  nestedIndex++
                  if(nestedIndex < totalNestedQuestion){
                    endpoints.nestedQuestion()
                  }else{
                    if(text == 'yes' || text === 'y'){
                      nestedData[key] = values
                      data[questionArray[index].name] = nestedData
                      nestedIndex = 0
                      endpoints.nestedQuestion()
                    }else{
                      nestedData[key] = values
                      data[questionArray[index].name] = nestedData
                      index++
                      endpoints.question()
                    }
                  }
                })
              }
              endpoints.nestedQuestion()
            }else{
              index++
            }
          }else{
            index++
          }
        }
        if(index < totalQuestion){
          endpoints.question()
        }else{
          if(value === 'yes' || value === 'y'){
            console.clear()
            listEndpoint.push(data)
            endpoints.init()
          }else{
            listEndpoint.push(data)
            const spinner = ora('Your endpoints are still being created').start()
            fs.writeFile('dokuin.endpoints.json', JSON.stringify(listEndpoint, null, 2), (err, done) => {
              if(err){
                console.log('error')
              }else{
                spinner.succeed('Your endpoints have been created')
                readline.close()
              }
            })
          }
        }
      })
    }
    endpoints.question()
  }
  endpoints.init()
}