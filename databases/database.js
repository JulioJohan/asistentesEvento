import mongoose from "mongoose";

const conectarBaseDatos = () => {
    console.log('conectarBaseDatos');
    try {
        // mongoose.connect(`${process.env.}`)
    } catch (error) {
        console.log(error)
    }

}

export default conectarBaseDatos;
