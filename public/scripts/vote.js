/* eslint-disable @typescript-eslint/restrict-template-expressions */

function putVote(fields) {
  fetch(`/api/vote`, {
    method: "PUT",
    body: JSON.stringify({
      userId: fields.userId,
      freetId: fields.freetId,
      vote: Number(fields.vote),
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then(showResponse)
    .catch(showResponse);
}

function getFreetVotes(fields) {
  fetch(`/api/vote/freet/${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}

function getUserVotes(fields) {
  fetch(`/api/vote/user/${fields.userId}`)
    .then(showResponse)
    .catch(showResponse);
}
