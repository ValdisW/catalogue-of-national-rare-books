function work() {
  fetch("/data/introduction-preload")
    .then((res) => res.json())
    .then((data) => postMessage(data));
}

work();
