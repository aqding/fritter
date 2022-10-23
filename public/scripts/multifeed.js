function getMultifeed(fields) {
  fetch(`/api/multifeed/${fields.multifeedId}`)
    .then(showResponse)
    .catch(showResponse);
}

function getMultifeedByUser(fields) {
  fetch(`/api/multifeed/user?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createMultifeed(fields) {
  console.log(fields);
  fetch("/api/multifeed", {
    method: "POST",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function updateMultifeed(fields) {
  fetch("/api/multifeed", {
    method: "PUT",
    body: JSON.stringify(fields),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function deleteMultifeed(fields) {
  fetch(`/api/multifeed/${fields.multifeedId}`, { method: "DELETE" })
    .then(showResponse)
    .catch(showResponse);
}
