import mongoose from "mongoose";

const conectarBaseDatos = async () => {
    try {
        await mongoose.connect(`${process.env.BASE_DATOS}`)
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error)
    }

}

export default conectarBaseDatos;
