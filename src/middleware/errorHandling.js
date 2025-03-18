
export const errotHandling = (err , req , res , next) => {
    console.log(err.stack)
    res
    .status(500)
    .json( {
        status : 500,
        message : "something went wrong",
        err : err.message
    })
}