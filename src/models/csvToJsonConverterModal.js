import "dotenv/config"
import fs from 'fs'
import csv from 'csv-parser'
import { pgp , poolPromisified } from '../config/db.js'

const formatRawJsonToRequiredFormat = (results) => {
    const users = results.map( (currUser) => {
        const formattedUserData =  { 
            name : currUser["name"]["firstname"] + currUser["name"]["lastname"],
            age : currUser["age"],
            address : currUser["address"],
            gender : currUser["gender"],
            additional_info : {}
        }

        const mandatoryKey = ["name" , "age" , "address" , "gender"]

        for(const key in currUser) {
            if(!mandatoryKey.includes(key)) {
              formattedUserData["additional_info"][key] = currUser[key]
            }
        }

        return formattedUserData
    })

    return users
}

const addDataToDB = async (results , next) => {
    const users = formatRawJsonToRequiredFormat(results)
    const columns = new pgp.helpers.ColumnSet(["name", "age", "address", "additional_info"], { table: "users" });
    const query = pgp.helpers.insert(users, columns);
    const ageDistributionQuery = `
    SELECT 
        CASE 
            WHEN age < 20 THEN '< 20'
            WHEN age BETWEEN 20 AND 40 THEN '20 to 40'
            WHEN age BETWEEN 40 AND 60 THEN '40 to 60'
            ELSE '> 60'
        END AS age_group,
        ROUND((COUNT(*) * 100.0) / (SELECT COUNT(*) FROM users), 2) AS percentage
    FROM users
    GROUP BY age_group
    ORDER BY age_group;
    `;

    const ageDistributionNumber = `
    SELECT 
        CASE 
            WHEN age < 20 THEN '< 20'
            WHEN age BETWEEN 20 AND 40 THEN '20 to 40'
            WHEN age BETWEEN 40 AND 60 THEN '40 to 60'
            ELSE '> 60'
        END AS age_group,
        COUNT(*) AS count
    FROM users
    GROUP BY age_group
    ORDER BY age_group;
    `
    try {
        await poolPromisified.none(query)
        const ageDistrinutionData = await poolPromisified.any(ageDistributionQuery)
        const ageDistrinutionNumber = await poolPromisified.any(ageDistributionNumber)  
     
        console.log(ageDistrinutionData)
        console.log(ageDistrinutionNumber)
    } catch (err) {
       throw err 
    }

    return users
}

export const convertCsvToJsonRaw = async (next) => {
    let allUserData = []
   
    try {
      await new Promise( (res , rej) => { fs.createReadStream(process.env.CSV_FILE_PATH)
        .pipe(csv())  // Parse CSV
        .on("data", async (data) => { 
            const results = {}
            let nestedRefrence = results

            for(const key in data) {
                const keySplitByDot = key.split('.')
                nestedRefrence = results
                let prevRefrenceOfNestedRefrence = nestedRefrence
                let prevKeyForThatRefrence = null

                keySplitByDot.forEach( (currentKey) => {
                    if(nestedRefrence.hasOwnProperty(currentKey)) {
                       prevKeyForThatRefrence = currentKey 
                       prevRefrenceOfNestedRefrence = nestedRefrence 
                       nestedRefrence = nestedRefrence[currentKey]
                    } else {
                        nestedRefrence[currentKey] = {}
                        prevRefrenceOfNestedRefrence = nestedRefrence
                        prevKeyForThatRefrence = currentKey 
                        nestedRefrence = nestedRefrence[currentKey]
                    }  
                })

                prevRefrenceOfNestedRefrence[prevKeyForThatRefrence] = data[key]
            }

            allUserData.push(results)
        }) // Store each row
        .on("end", () => {
            res("")
        })
        .on("error", (err) => {
            rej(err)
        })});
    } catch (err) {
        throw err;
    }    
    
    try {
        allUserData = addDataToDB(allUserData , next)
    } catch (err) {
        throw err;
    }   

    return allUserData
}