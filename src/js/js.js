let value = "Bubble";
const titleElement = document.getElementById("title");
const visual_container = document.getElementById("visual-container");
const dataValues = document.getElementById("arrayInput");
const startButton = document.getElementById("start-button");
const speedInput = document.getElementById("speed");
const restartBtn = document.getElementById("restartBtn");
let speed = 200;

function convertToArray() {
  const inputText = dataValues.value;

  const numbersArray = inputText
    .split(",")
    .map((number) => parseInt(number.trim(), 10));
  return numbersArray;
}

let data = convertToArray();
const dataCopy = [...data];
const chartContainer = document.querySelector("#visual-container");

function renderChart(arr = data) {
  chartContainer.innerHTML = "";

  const maxValue = Math.max(...arr);

  arr.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    bar.style.setProperty("--tag", `bar-${index}`);
    const percentageHeight = (value / maxValue) * 100;
    bar.style.height = `${percentageHeight}%`;
    bar.textContent = value;
    chartContainer.appendChild(bar);
  });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// bubble sort
async function bubbleSortWithDelay(arr) {
  const len = arr.length;
  let swapped;

  async function sort() {
    do {
      swapped = false;
      for (let i = 0; i < len - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;
          console.log(arr);
          document.startViewTransition(() => renderChart());

          await delay(speed);
        }
      }
    } while (swapped);
  }

  return sort().then(() => arr);
}
//end bubble sort

// selection sort
async function selectionSortWithDelay(arr) {
  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;

      const transition = document.startViewTransition(() => renderChart());

      await delay(speed);
    }
  }

  return arr;
}
// end selection sort

// insrtion sort
async function insertionSortWithDelay(arr) {
  const len = arr.length;

  for (let i = 1; i < len; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
    await delay(speed);
    const transition = document.startViewTransition(() => renderChart());
  }

  return arr;
}
// end insertion sort

// merge sort algo
async function mergeSortWithDelay(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    await mergeSortWithDelay(arr, left, mid);
    await mergeSortWithDelay(arr, mid + 1, right);
    await merge(arr, left, mid, right);
  }
  return arr;
}

async function merge(arr, left, mid, right) {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;

  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k++] = leftArr[i++];
    } else {
      arr[k++] = rightArr[j++];
    }
  }

  while (i < leftArr.length) {
    arr[k++] = leftArr[i++];
  }

  while (j < rightArr.length) {
    arr[k++] = rightArr[j++];
  }

  await delay(speed);
  const transition = document.startViewTransition(() => renderChart());
}
// end merge sort algo

async function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const randomNumber = Math.floor(Math.random() * arr.length);

  const pivot = arr[randomNumber];
  const leftArr = [];
  const rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }

    const transition = document.startViewTransition(() =>
      renderChart([...leftArr, pivot, ...rightArr])
    );
  }

  await delay(speed);

  const left = await quickSort(leftArr);
  const right = await quickSort(rightArr);
  const transition = document.startViewTransition(() =>
    renderChart([...left, pivot, ...right])
  );

  return [...left, pivot, ...right];
}

// quickSort block
async function partition(arr, low, high) {
  let temp;
  let pivot = arr[high];

  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (arr[j] <= pivot) {
      i++;

      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    await delay(speed);
    const transition = document.startViewTransition(() => renderChart());
  }

  temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;

  await delay(speed);
  const transition = document.startViewTransition(() => renderChart());

  return i + 1;
}

async function qSort(arr, low, high) {
  if (low < high) {
    let pi = await partition(arr, low, high);

    await qSort(arr, low, pi - 1);
    await qSort(arr, pi + 1, high);
  }
}
// end quickSort block

// Initial Render of bars/chart
renderChart();
startButton.addEventListener("click", function () {
  restart();

  startButton.disabled = true;
  if (value === "Bubble") {
    bubbleSortWithDelay(data).then((sortedArray) => {
      console.log("Sorted array:", sortedArray);
      startButton.disabled = false;
    });
  } else if (value === "Insertion") {
    insertionSortWithDelay(data).then((sortedArray) => {
      console.log("Sorted array:", sortedArray);
      startButton.disabled = false;
    });
  } else if (value === "Selection") {
    selectionSortWithDelay(data).then((sortedArray) => {
      console.log("Sorted array:", sortedArray);
      startButton.disabled = false;
    });
  } else if (value === "Merge") {
    mergeSortWithDelay(data).then((sortedArray) => {
      console.log("Sorted array:", sortedArray);
      startButton.disabled = false;
    });
  } else if (value === "Quick") {
    qSort(data, 0, data.length - 1).then(() => {
      console.log("Sorted array:", data);
      startButton.disabled = false;
    });
  }
});

// click listener to array input
dataValues.addEventListener("change", function () {
  try {
    data = convertToArray();
    renderChart();
  } catch (e) {
    console.log(e);
  }
});

speedInput.addEventListener("change", function (event) {
  speed = event.target.value;
});
// end click lister to array input

// drop down stuff
function toggleDropdown() {
  const dropdown = document.getElementById("myDropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
};

// end drop down stuff

function updateTitle() {
  titleElement.innerText = value;
}

function bobbleAlgo() {
  value = "Bubble";
  updateTitle();
}

function selectAlgo() {
  value = "Selection";
  updateTitle();
}

function insertAlgo() {
  value = "Insertion";
  updateTitle();
}

function mergeAlgo() {
  value = "Merge";
  updateTitle();
}

function quickAlgo() {
  value = "Quick";
  updateTitle();
}

function restart() {
  data = convertToArray();
  const transition = document.startViewTransition(() => renderChart());
}
