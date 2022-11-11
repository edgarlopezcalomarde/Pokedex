

const buscador = document.getElementById("buscador")
const btnBuscar = document.getElementById("btnBuscar")

const pantalla = document.querySelector(".pantalla")


const pkeNo = document.querySelector(".no")
const pkeNombre = document.querySelector(".nombre")


const pkeDescripcion = document.querySelector(".descripcion")
const pkeTypes = document.querySelector(".types")

const pkeStats = document.querySelector(".stats")

const pkeHabilidades = document.querySelector(".habilidades")

const pkeEvoluciones = document.querySelector(".evoluciones")


const pkeBorder = document.querySelector(".pokeBorder")

const pkeTypeColors = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD',
};


const pkeSelect =document.getElementById("pkeSelect")



const searchDescription = (url) =>{
    let  xhr = new XMLHttpRequest()
    xhr.open("GET",url)
    xhr.responseType = "json"
    xhr.send()

    xhr.addEventListener("load", ()=>{
        const response = xhr.response

        //Descripcion
        pkeDescripcion.innerHTML = response.flavor_text_entries.find(entry => entry.language.name == "es").flavor_text

    })


}


const paintEvolution = (nombre) =>{
    let  xhr = new XMLHttpRequest()
    xhr.open("GET",`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    xhr.responseType = "json"
    xhr.send()

    xhr.addEventListener("load", ()=>{

        const response = xhr.response

       
        pkeEvoluciones.innerHTML +=  `<img src = "${response.sprites.front_default}">`


        /*
         //img
         pantalla.innerHTML = ""
         const img = document.createElement("img")
         img.src = response.sprites.front_default
         img.classList.add("pokeimg")
         pantalla.appendChild(img)
 */

    })
}


const searchEvolution = url =>{
    let  xhr = new XMLHttpRequest()
    xhr.open("GET",url)
    xhr.responseType = "json"
    xhr.send()

    xhr.addEventListener("load", ()=>{
        const response = xhr.response

        let  xhr2 = new XMLHttpRequest()
        xhr2.open("GET", response.evolution_chain.url)
        xhr2.responseType = "json"
        xhr2.send()


        let evolutions = []

        xhr2.addEventListener("load", ()=>{

            const response2= xhr2.response


            evolutions.push(response2.chain.species.name) //Pequeñin

            
            response2.chain.evolves_to.forEach(entry =>{
              
                    evolutions.push(entry.species.name)
            
            })
           
            response2.chain.evolves_to.forEach(entry =>{
                entry.evolves_to.forEach(entry2 =>{
                    evolutions.push(entry2.species.name)
                })
            })

            pkeEvoluciones.innerHTML = ""   
            evolutions.forEach(evol => paintEvolution(evol))


        })


    })

    

   



}

const buscaPokemon = (nombre) =>{
    let  xhr = new XMLHttpRequest()
    xhr.open("GET",`https://pokeapi.co/api/v2/pokemon/${nombre}`)
    xhr.responseType = "json"
    xhr.send()

    xhr.addEventListener("load", ()=>{
        const response = xhr.response



        //ID
        pkeNo.innerHTML = response.id

        //Name
        pkeNombre.innerHTML =response.name.charAt(0).toUpperCase() + response.name.slice(1); 

        //img
        pantalla.innerHTML = ""
        const img = document.createElement("img")
        img.src = response.sprites.front_default
        img.classList.add("pokeimg")
        pantalla.appendChild(img)

        searchDescription(response.species.url)

        //Types
        pkeTypes.innerHTML =""

        response.types.forEach(type => {
            const typeBox = document.createElement("div")
            typeBox.appendChild(document.createTextNode(type.type.name))
            typeBox.classList.add("type")

            //Scar los tipos de un objeto de ayuda de colores
            Object.entries(pkeTypeColors).forEach(entry => {
                const [key, value] = entry;
            
                if(type.type.name == key){
                    typeBox.style.backgroundColor = value
                }

            });
            

            pkeTypes.appendChild(typeBox) 
        });



        //Stats
        pkeStats.innerHTML = ""

        let htmlStats = "<table>"  
        response.stats.forEach(entry =>{
            htmlStats += "<tr class='row'>" 

            htmlStats += `<td class='principal'> ${entry.stat.name}</td>`
            htmlStats += `<td  class='alternative'> ${entry.base_stat}</td>`
          
            htmlStats +="</tr>"

        })

        htmlStats += "</table>"

        pkeStats.innerHTML =htmlStats

        //Habilidades

        pkeHabilidades.innerHTML = ""
        response.abilities.forEach(entry =>{
            pkeHabilidades.innerHTML += `<div class='habilidad'> ${entry.ability.name} </div>`
        })



        //Evolucuiones

        searchEvolution(response.species.url)

        pkeBorder.classList.remove("oculto")

    })
}


const cargarListaPokemons =  () =>{

    let xhr = new XMLHttpRequest()
    xhr.open("GET", "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
    xhr.responseType = "json"
    xhr.send()


    xhr.addEventListener("load", ()=>{

        const response = xhr.response
        const select = document.createElement("select")
        const fragment = document.createDocumentFragment()

        response.results.forEach((entry,index) =>{
            const option = document.createElement("option")
            option.value = entry.name
            option.appendChild(document.createTextNode(entry.name))
        
            fragment.appendChild(option)
        })

       

        select.addEventListener("change", ()=>{
        
            buscaPokemon(select.value)
        })

        select.appendChild(fragment)
        pkeSelect.appendChild(select)

    })
    
}




btnBuscar.addEventListener("click", ()=>{
    console.log(buscador.value)
    
    buscaPokemon(buscador.value.toLowerCase())
})


cargarListaPokemons()








