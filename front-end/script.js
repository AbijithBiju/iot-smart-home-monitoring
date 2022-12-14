let btn = document.getElementById("switch");

const updateStyle=(init)=>{
    if (init) {
        btn.style.backgroundColor = "green";
        btn.setAttribute("value", "ON");
      } else {
        btn.style.backgroundColor = "red";
        btn.setAttribute("value", "OFF");
      }
}

let init = false;

fetch("http://localhost:3000/switch")
  .then(response => response.text())
  .then(result => {
    init = result === '1' ? true : false
    console.log(result,init)
    updateStyle(init)
})
  .catch(error => console.log('error', error));


const updateSwitch = () => {
  init = !init;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    switch: init,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:3000/switch", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

btn.addEventListener("click", () => {
  updateSwitch();
  console.log(init);
  console.log(btn.value);
  updateStyle(init)
});
