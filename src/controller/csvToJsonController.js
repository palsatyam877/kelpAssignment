import { errotHandling } from "../middleware/errorHandling.js"
import { convertCsvToJsonRaw } from "../models/csvToJsonConverterModal.js"

const handleResponse = (res , status , message , data = null) => {
    res
    .status(status)
    .json({
       status,
       message,
       data
    })
}

export const generateAgeWiseDisributionReport = async (req , res , next) => {
   try {
      const rawJsonData = await convertCsvToJsonRaw()
      handleResponse(res , 200 , "raw json data" , rawJsonData)
   } catch (err) {
       next(err)
   }
}  