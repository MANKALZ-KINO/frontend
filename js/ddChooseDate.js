const urlDates = "http://localhost:8080/dates";
console.log("Jeg er i ddChooseDate");

const ddDate = document.getElementById("ddDato");

async function fetchDates(){
    try {
        const response = await fetch(urlDates)

        if (!response.ok) {
            throw new Error("fejl ved hentning af datoer....." + response.statusText)
        }
        const dates = await response.json();
        ddDate.innerHTML = "<option value=''>Choose a Date</option>";

        dates.forEach(date => {
            const option = document.createElement("option");
            option.textContent = date;
            option.value = date;
            ddDate.appendChild(option);
        });
    } catch (error){
        console.log("Error fetching Dates")
    }

    }


console.log("Jeg er i ddChooseDate");
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event fired");
    fetchDates();
});

//document.addEventListener("DOMContentLoaded", fetchDates);
