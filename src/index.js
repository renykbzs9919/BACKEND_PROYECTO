import app from "./app.js";
import "./database.js";
import { PORT } from "./config.js";
import "./libs/initialSetup.js";

app.listen(PORT);
console.log("Servidor corriendo en el puerto : ", app.get("port"));
