const d = document,
    $shows = d.getElementById("shows"),
    $template = d.getElementById("show-template").content,
    $fragment = d.createDocumentFragment();
//agrego el evento para cuando el usuario toque la tecla enter
d.addEventListener("keypress", async e => {
    //cuando el evento sea del input search
    if(e.target.matches("#search")){
        //solo quiero que funcione con la tecla "enter"
        if(e.key === "Enter"){
            try {
                $shows.innerHTML = `<img class="loader" src ="assets/loader.svg" alt="Cargando...">`;
                //fuerzo a minusculas lo ingresado
                let query = e.target.value.toLowerCase(),
                    //consulto el endPoint de la API (está en la documentación como Show Search)
                    //donde indica que hay que cambiarle el final de la url con el show
                    api = `https://api.tvmaze.com/search/shows?q=${query}`,
                    res = await fetch(api),
                    json = await res.json();

                    console.log(api, res, json);
                    //manipulo error
                    if(!res.ok) throw {status: res.status, statusText: res.statusText}

                    //creo condición si no hubo resultado en la busqueda
                    //y el "else" si hay coincidencias
                    if(json.length === 0){
                        $shows.innerHTML = `<h2> No existen resultados de shows para <mark>"${query}"</mark>`;
                    }else{
                        json.forEach(el => {
                            //pongo los datos de los shows, el nombre de las propieades se pueden ver en el archivo json
                            $template.querySelector("h3").textContent = el.show.name;
                            //el show puede o no tener descripción, contemplo los dos datos
                            $template.querySelector("div").innerHTML = el.show.summary ? el.show.summary : "Sin Descripción";
                            //ahora busco el psoter de la foto y contemplo los dos casos
                            $template.querySelector("img").src = el.show.image 
                                ? el.show.image.medium 
                                : "http://static.tv.maze.com/images/no-img-portrait-text.png";

                            $template.querySelector("img").alt = el.show.name;
                            $template.querySelector("img").style.maxWidth = "100%";
                            $template.querySelector("p").textContent = el.show.rating
                                ? el.show.rating.average
                                :"No hay puntuación";
                            $template.querySelector("a").href = el.show.url    
                                ? el.show.url
                                : "#";
                            $template.querySelector("a").target = el.show.url   
                                ? "_blank"
                                : "_self";
                            $template.querySelector("a").textContent = el.show.url 
                                ? "ver más.."
                                : "";

                            let $clone = d.importNode($template, true);

                            $fragment.appendChild($clone);
                        });
                        //no puedo utilizar innerHTML para insertar los datos de los shows porque esto solo sirve para texto
                        //así que lo trato como nodo
                        $shows.innerHTML = ""; //borro el loader
                        $shows.appendChild($fragment);
                    }
            } catch (err) {
                console.log(err);
                let message = err.statusText || "Ocurrió un error";
                $shows.innerHTML = `<p>Error ${err.status}: ${message} </p>`;
    
            }
        }
    }
});