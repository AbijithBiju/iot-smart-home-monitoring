let temp = [];
let sound = [];
let humidity = [];
let xaxis = [];
let line = null;
let color = 'white'


const update = () => {
  fetch("https://iot-smart-home.onrender.com")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      temp = [];
      pressure = [];
      humidity = [];
      xaxis = [];
      for (let val of data.data) {
        temp.push(val.temp);
        sound.push(val.sound);
        humidity.push(val.humidity);
        xaxis.push(Date(val.time).split(" ")[4]);
      }
      checkSelections()
    })
    .then(() => {
      renderGraph();
    });
};

window.setInterval(() => {
  update();
}, 3000);

const renderGraph = () => {
  line = new Chart("myChart", {
    type: "line",
    data: {
      labels: xaxis.splice(-10),
      datasets: [
        {
          data: temp.splice(-10),
          label: "temperature",
          borderColor: "rgb(92, 212, 74)",
          backgroundColor: "rgba(92, 212, 74,0.2)",
          fill: true,
        },
        {
          data: humidity.splice(-10),
          label: "humidity",
          borderColor: "rgb(74, 147, 212)",
          backgroundColor: "rgba(74, 147, 212,0.2)",
          fill: true,
        },
        {
          data: sound.splice(-10),
          label: "sound",
          borderColor: "rgb(235, 21, 235)",
          backgroundColor: "rgba(235, 21, 235,0.2)",
          fill: true,
        },
      ],
    },
    options: {
      legend: {
        labels: { 
            fontColor: color,
            fontSize: 16
        }
    },
      scales: {
        yAxes: [{
          ticks: {
              fontColor: color,
              fontSize: 14,
              beginAtZero: true
          },gridLines:{
        color : color
        }
      }],
      xAxes: [{
          ticks: {
              fontColor: color,
              fontSize: 14,
              beginAtZero: true
          },gridLines:{
        color : color
        }
      }]
      },
      animation: {
        duration: 0,
      },
    },
  });
};

const checkbox = document.getElementById('checkbox');
let dark = false;
checkbox.addEventListener('change', ()=>{
  document.body.classList.toggle('dark');
  dark = !dark
  document.getElementById('heading').style.color = dark ? 'black' : 'white'
  document.getElementsByClassName('label')[0].style.backgroundColor = dark ? '#d1c9c9':'black'
  document.getElementsByClassName('ball')[0].style.backgroundColor = dark ? 'black':'white'
  if(dark){
    color = 'black'
    line.config.options.legend.labels.fontColor = color
    line.config.options.scales.xAxes[0].ticks.fontColor = color
    line.config.options.scales.xAxes[0].gridLines.color = color
    line.config.options.scales.yAxes[0].ticks.fontColor = color
    line.config.options.scales.yAxes[0].gridLines.color = color
    for(let label of document.getElementsByClassName('selector-lable')){
      label.style.color = color
    }
  }else{
    color = 'white'
    line.config.options.legend.labels.fontColor = color
    line.config.options.scales.xAxes[0].ticks.fontColor = color
    line.config.options.scales.xAxes[0].gridLines.color = color
    line.config.options.scales.yAxes[0].ticks.fontColor = color
    line.config.options.scales.yAxes[0].gridLines.color = color
    for(let label of document.getElementsByClassName('selector-lable')){
      label.style.color = color
    }
  }
  line.update()
  console.log(dark,color)
  console.log(line.config)
})

const checkSelections=()=>{
  if(!document.getElementById('temp').checked){
    temp=[]
    line.update()
  }
    
  if(!document.getElementById('humidity').checked){
    humidity=[]
    line.update()
  }
    
  if(!document.getElementById('sound').checked){
    sound=[]
    line.update()
  }
    

}