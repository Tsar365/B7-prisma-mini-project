import app from "./app";
import { prisma } from "./lib/prisma";
import "dotenv/config";
import config from "./config";

const PORT = config.port;

async function main() {
 
 try{
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    })

 }  catch(error){
console.log("error occurred:", error);
await prisma.$disconnect();
process.exit(1);
 } 
}
main();